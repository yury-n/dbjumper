
const getTableMeta = (con, done, error, table) => {
    // to be implemented
    return;
    con.query('SHOW FULL COLUMNS FROM ' + table, (err, rows) => {
        return done(rows);
    });
};

export default getTableMeta;