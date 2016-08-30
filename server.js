import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.babel';
import Express from 'express';
import favicon from 'serve-favicon';
import * as mysqldb from './server/mysqldb';
import dotenv from 'dotenv';

const app = new Express();
const port = 3000;

const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
}));

dotenv.config();

app.use('/static', Express.static(__dirname + '/static'));
app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', (req, res) => {
    switch (req.query.action) {
        case 'get_tables_listing':
            _useReponseFromMysqldbFunc('getTablesListing', req, res);
            break;
        case 'get_table_data':
            _useReponseFromMysqldbFunc('getTableData', req, res, req.query.query);
            break;
        case 'get_table_meta':
            _useReponseFromMysqldbFunc('getTableMeta', req, res, req.query.table);
            break;
        default:
            res.sendFile(path.join(__dirname, 'index.html'));
    }
});

const _useReponseFromMysqldbFunc = (funcName, req, res, ...args) => {
    const onError = error => {
        con.end();
        res.statusMessage = error;
        res.status(400).end();
    };
    const con = mysqldb.getDbConnection(onError);
    mysqldb[funcName](
        con,
        results => {
            con.end();
            res.json(results);
        },
        onError,
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
