import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel';
import Express from 'express';
import favicon from 'serve-favicon';
import * as mysqldb from './mysqldb';

const app = new Express();
const port = 3000;

const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
}));

app.use('/static', Express.static(__dirname + '/static'));
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/get_tables_listing', (req, res) => {
    _useReponseFromMysqldbFunc('getTablesListing', req, res);
});

app.get('/get_table_data', (req, res) => {
    _useReponseFromMysqldbFunc('getTableData', req, res, req.query.query);
});

const _useReponseFromMysqldbFunc = (funcName, req, res, ...args) => {
    const con = mysqldb.getDbConnection();
    mysqldb[funcName](
        con,
        results => {
            con.end();
            res.json(results);
        },
        error => {
            con.end();
            res.statusMessage = error;
            res.status(400).end();
        },
        ...args
    );
};

app.listen(port, error => {
    /* eslint-disable no-console */
    if (error) {
        console.error(error);
    } else {
        console.info(
          '🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.',
          port,
          port
        );
    }
    /* eslint-enable no-console */
});
