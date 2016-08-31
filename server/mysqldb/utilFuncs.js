
export const getExistingTables = (con) => {
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

export const getExistingColumns = (con, tables) => {
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