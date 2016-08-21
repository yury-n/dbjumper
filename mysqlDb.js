import mysql from 'mysql';

const HOST     = '192.168.10.10';
const USER     = 'homestead';
const PASSWORD = 'secret';
const DATABASE = 'gifster';

const getDbConnection = () => {

    const connection = mysql.createConnection({
        host     : HOST,
        user     : USER,
        password : PASSWORD,
        database : DATABASE
    });

    connection.connect(err => {
        if (err) throw(err);
    });

    return connection;
};

export const getTablesListing = (done) => {

    const con = getDbConnection();

    con.query(`
        SELECT 
            TABLE_NAME, COLUMN_NAME, COLUMN_KEY 
        FROM 
            INFORMATION_SCHEMA.COLUMNS 
        WHERE 
            TABLE_SCHEMA = "${DATABASE}" 
    `, (err, rows) => {
        if (err) throw(err);

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

        con.end();
        done(results);
    });
};

export const getTableData = (query, done) => {

    const con = getDbConnection();

    const queryParts = query.split('.');
    const requestedTable = queryParts[0];

    con.query('SHOW TABLES', (err, rows) => {

        const existingTables = rows.map(row => {
            let key = Object.keys(row)[0];
            return row[key];
        });

        if (!existingTables.includes(requestedTable)) {
            throw('Invalid table name.');
        }

        let dbQuery = 'SELECT * FROM ' + requestedTable;

        if (typeof queryParts[1] == 'undefined') {
            dbQuery += ' LIMIT 10';
            con.query(dbQuery, (err, rows) => {
                con.end();
                done(rows);
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
                    AND TABLE_SCHEMA = "${DATABASE}"
            `, (err, rows) => {

                const existingColumns = rows.map(row => row['COLUMN_NAME']);

                const filteringPairs = filtering.split(';');

                let queryArgs = [];

                filteringPairs.forEach(filteringPair => {
                    let [ key, value ] = filteringPair.split('=');
                    if (!existingColumns.includes(key)) {
                        throw('Invalid column name.');
                    }
                    if (typeof value == 'undefined') {
                        throw('Invalid query. Missing filter value.');
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

                dbQuery += ' LIMIT 100';

                con.query(dbQuery, queryArgs, (err, rows) => {
                    con.end();
                    done(rows);
                });
            });
        }
    });
};