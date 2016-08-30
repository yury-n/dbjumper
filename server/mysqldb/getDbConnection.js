import mysql from 'mysql';

const getDbConnection = (error) => {

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

export default getDbConnection;