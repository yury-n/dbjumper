import { getExistingTables } from './utilFuncs';

const getTableMeta = (con, done, error, table) => {
    getExistingTables(con).then(existingTables => {
        if (!existingTables.includes(table)) {
            return error('Nonexistent table.');
        }
        con.query('SHOW FULL COLUMNS FROM ' + table, (err, rows) => {
            return done(rows);
        });
    }, error);
};

export default getTableMeta;