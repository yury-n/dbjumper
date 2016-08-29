import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

export const getDbConnection = (error) => {

    const connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        port     : process.env.DB_PORT,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_DATABASE
    });

    connection.connect(err => {
        if (err) {
            error('Failed to connect.');
        }
    });

    return connection;
};

export const getTablesListing = (con, done, error) => {

    con.query(`
        SELECT 
            TABLE_NAME, COLUMN_NAME, COLUMN_KEY 
        FROM 
            INFORMATION_SCHEMA.COLUMNS 
        WHERE 
            TABLE_SCHEMA = "${process.env.DB_DATABASE}" 
    `, (err, rows) => {
        if (err) {
            return error('SQL query failed.');
        }

        let results = {};
        rows.forEach(row => {
            const tableName = row['TABLE_NAME'];
            const columnName = row['COLUMN_NAME'];
            const columnKey = row['COLUMN_KEY'];
            const columnGroup = (columnKey == '' ? 'nonindexed_columns' : 'indexed_columns');
            if (typeof results[tableName] == 'undefined') {
                results[tableName] = {
                    'indexed_columns': [],
                    'nonindexed_columns': []
                }
            }
            results[tableName][columnGroup].push(columnName);
        });

        return done(results);
    });
};

export const getTableMeta = (con, done, error, table) => {

    con.query('SHOW FULL COLUMNS FROM ' + table, (err, rows) => {
        return done(rows);
    });
};

export const getTableData = (con, done, error, query) => {

    const queryParts = query.split('.');
    const requestedTable = queryParts[0];

    con.query('SHOW TABLES', (err, rows) => {

        const existingTables = rows.map(row => {
            let key = Object.keys(row)[0];
            return row[key];
        });

        if (!existingTables.includes(requestedTable)) {
            return error('Invalid table name.');
        }

        let dbQuery = 'SELECT * FROM ' + requestedTable;

        if (typeof queryParts[1] == 'undefined') {
            dbQuery += ' LIMIT 10';
            con.query(dbQuery, (err, rows) => {
                return done(rows);
            });
        } else {
            dbQuery += ' WHERE 1=1 ';

            const filtering = queryParts[1];

            con.query(`
                SELECT 
                    COLUMN_NAME
                FROM 
                    INFORMATION_SCHEMA.COLUMNS 
                WHERE
                    TABLE_NAME = "${requestedTable}"
                    AND TABLE_SCHEMA = "${process.env.DB_DATABASE}"
            `, (err, rows) => {

                const existingColumns = rows.map(row => row['COLUMN_NAME']);

                const filteringPairs = filtering.split(';');

                let queryArgs = [];

                let filteringInvalid = false;
                filteringPairs.forEach(filteringPair => {
                    if (filteringInvalid) {
                        return;
                    }
                    let [ key, value ] = filteringPair.split('=');
                    if (!existingColumns.includes(key)) {
                        filteringInvalid = true;
                        return error('Invalid column name.');
                    }
                    if (typeof value == 'undefined' || value === '') {
                        filteringInvalid = true;
                        return error('Invalid query. Missing filter value.');
                    }
                    if (value.indexOf(',') === -1) {
                        dbQuery += `AND ${key} = ? `;
                        queryArgs.push(value);
                    } else {
                        let values = value.split(',');
                        let qMarks = '?,'.repeat(values.length - 1) + '?';
                        dbQuery += `AND ${key} IN (${qMarks}) `;
                        queryArgs = [...queryArgs, ...values];
                    }
                });

                if (filteringInvalid) {
                    return;
                }

                dbQuery += ' LIMIT 100';

                con.query(dbQuery, queryArgs, (err, rows) => {
                    if (err) {
                        return error('SQL query failed.');
                    }
                    return done(rows);
                });
            });
        }
    });
};