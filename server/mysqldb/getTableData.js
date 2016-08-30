
const getTableData = (con, done, error, query) => {

    /*
     * GENERATE querySchema FROM query
     */

    const querySchema = _generateQuerySchema(query);

    /*
     * INTRODUCE FIRST TABLE/JOINED TABLES VARS FOR CONVENIENCE
     */
    const firstTableSchema = querySchema[0];
    const firstTable = firstTableSchema['table'];
    const joinedTablesSchemas = querySchema.slice(1);

    _getExistingTables(con).then(existingTables => {

        /*
         * REQUESTED TABLES VALIDATION
         */
        const requestedTables = querySchema.map(tableSchema => tableSchema.table);

        let tableValidationError = null;
        requestedTables.forEach(requestedTable => {
            if (!existingTables.includes(requestedTable)) {
                tableValidationError = `Nonexistent table '${nonexistentTable}'.`
            }
        });
        if (tableValidationError) {
            return error(tableValidationError);
        }

        /*
         * FETCH ALL EXISTING COLUMNS FOR THE REQUESTED TABLES
         */
        _getExistingColumns(con, requestedTables).then(existingColumns => {

            /*
             * VALIDATE COLUMNS USED IN FILTERS
             */
            let filterColumnValidationError = null;

            querySchema.forEach(tableSchema => {
                const { table, filters } = tableSchema;
                const filterKeys = Object.keys(filters);
                filterKeys.forEach(key => {
                    const value = filters[key];
                    if (typeof value == 'undefined') {
                        filterColumnValidationError = `Missing filter value for key '${key}'.`;
                    }
                    if (!existingColumns[table].includes(key)) {
                        filterColumnValidationError = `Nonexistent column '${key}'.`;
                    }
                })
            });
            if (filterColumnValidationError) {
                return error(filterColumnValidationError);
            }

            /*
             * VALIDATE COLUMNS USED IN JOINS
             */
            let joinColumnValidationError = null;

            joinedTablesSchemas.forEach(tableSchema => {
                const { table, joinBy } = tableSchema;
                const [ firstTableKey, joinedTableKey ] = joinBy;

                if (!existingColumns[firstTable].includes(firstTableKey)) {
                    joinColumnValidationError = `Nonexistent column '${firstTableKey}' used in join statement.`;
                }
                if (!existingColumns[table].includes(joinedTableKey)) {
                    joinColumnValidationError = `Nonexistent column '${joinedTableKey}' used in join statement.`;
                }
            });
            if (joinColumnValidationError) {
                return error(joinColumnValidationError);
            }

            /*
             * ATTACH COLUMNS TO FETCH TO THE SCHEMA VARS
             * IF COLUMN IS USED IN JOIN PLACE IT FIRST
             */
            firstTableSchema['columns'] = existingColumns[firstTable];

            joinedTablesSchemas.forEach((tableSchema, index) => {
                const { table, joinBy } = tableSchema;
                const joinedTableKey = joinBy[1];
                joinedTablesSchemas[index]['columns'] = existingColumns[table].sort((a, b) => {
                    if (a == joinedTableKey) {
                        return -1;
                    } else if (b == joinedTableKey) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            });

            /*
             * BUILD SQL QUERY
             */

            let dbArgs = [];
            let dbQuery = 'SELECT \n';

            const firstTableColumns = firstTableSchema['columns'].map(column => firstTable+'.'+column);
            dbQuery += firstTableColumns.join(', ') + '\n';

            joinedTablesSchemas.forEach(tableSchema => {
                const { table } = tableSchema;
                const joinedTableColumns = tableSchema['columns'].map(
                    column => `${table}.${column} as '${table}.${column}'`
                );
                dbQuery += ', ' + joinedTableColumns.join(', ') + '\n';
            });

            dbQuery += `FROM ${firstTable} \n`;

            joinedTablesSchemas.forEach(tableSchema => {
                const { table, joinBy } = tableSchema;
                const [ firstTableKey, joinedTableKey ] = joinBy;
                dbQuery += `LEFT JOIN ${table} ON ${firstTable}.${firstTableKey} = ${table}.${joinedTableKey} \n`;
            });

            dbQuery += ' WHERE 1=1 ';

            querySchema.forEach(tableSchema => {
                const { table, filters } = tableSchema;
                const filterKeys = Object.keys(filters);
                filterKeys.forEach(key => {
                    const value = filters[key];
                    if (value.includes(',')) {
                        dbQuery += `AND ${table}.${key} = ? `;
                        dbArgs.push(value);
                    } else {
                        const values = value.split(',');
                        const qMarks = '?,'.repeat(values.length - 1) + '?';
                        dbQuery += `AND ${table}.${key} IN (${qMarks}) `;
                        dbArgs = [...dbArgs, ...values];
                    }
                });
            });

            dbQuery += '\n LIMIT 20';

            /*
             * EXECUTE THE QUERY
             */
            con.query(dbQuery, dbArgs, (err, rows) => {
                if (err) {
                    return error(err);
                }
                return done(rows);
            });

        }, error);

    }, error);

};

/*
 * querySchema example:
 * [
 *     ['table' => 'users', 'filters' => ['id' => '1,2,3', 'name' => 'John']]
 *     ['table' => 'cart_orders', 'joinBy' => ['id', 'userid'], 'filters' => [...]]
 * ]
 */
const _generateQuerySchema = (query) => {

    const tablesAndRelatedParts = query.split('+');

    const querySchema = [];
    tablesAndRelatedParts.forEach(tableAndRelatedParts => {

        let table,
            joinBy,
            filters;

        if (tableAndRelatedParts.includes('(')) { // from syntax "+users(userid=id)..."
            // joined table
            const matches = tableAndRelatedParts.match(/^([^(]+)\(([^)]+)\)\.?(.+)?/);
            // e.g. products(id=userid).productname=bottle;status=3
            // matches[1] = 'products';
            // matches[2] = 'id=userid';
            // matches[3] = 'productname=bottle;status=3';
            table = matches[1];
            joinBy = matches[2] ? matches[2].split('=') : [];
            filters = matches[3] ? _parseFilterPartIntoAssocArray(matches[3]) : {};
        } else {
            // first table in the query
            const parts = tableAndRelatedParts.split('.');
            table = parts[0];
            filters = parts[1] ? _parseFilterPartIntoAssocArray(parts[1]) : {};
        }
        if (joinBy && joinBy.length == 1) {
            // if only one columnname specified in join part
            // it means it is the same columnname in the both tables we join
            joinBy[1] = joinBy[0];
        }
        querySchema.push({
            table,
            joinBy,
            filters
        });

    });

    return querySchema;
};

/*
 * e.g. converts
 * "productname=bottle;status=3"
 * into
 * {productname: 'bottle', status: 3}
 */
const _parseFilterPartIntoAssocArray = (filterPart) => {

    const filterPairs = filterPart.split(';');
    const filtersAssoc = {};
    filterPairs.forEach(filterPair => {
        const [key, value] = filterPair.split('=');
        filtersAssoc[key] = value;
    });
    return filtersAssoc;
};

const _getExistingTables = (con) => {
    return new Promise((resolve, reject) => {
        con.query('SHOW TABLES', (err, rows) => {
            if (err) {
                return reject(err);
            }
            const existingTables = rows.map(row => {
                let key = Object.keys(row)[0];
                return row[key];
            });

            return resolve(existingTables);
        });
    });
};

const _getExistingColumns = (con, tables) => {
    return new Promise((resolve, reject) => {
        con.query(`
                SELECT
                    TABLE_NAME,
                    COLUMN_NAME
                FROM 
                    INFORMATION_SCHEMA.COLUMNS 
                WHERE
                    TABLE_NAME IN ("` + tables.join('","') + `")
                    AND TABLE_SCHEMA = "${process.env.DB_DATABASE}"
            `, (err, rows) => {
            if (err) {
                return reject(err);
            }
            const existingColumns = {};
            rows.forEach(row => {
                const table = row['TABLE_NAME'];
                const column = row['COLUMN_NAME'];
                if (typeof existingColumns[table] == 'undefined') {
                    existingColumns[table] = [];
                }
                existingColumns[table].push(column);
            });
            return resolve(existingColumns);
        });
    });
};

export default getTableData;