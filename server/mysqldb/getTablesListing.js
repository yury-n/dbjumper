
const getTablesListing = (con, done, error) => {

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

export default getTablesListing;