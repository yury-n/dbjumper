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
    mysqldb.getTablesListing(results => res.json(results));
});

app.get('/get_table_data', (req, res) => {
    mysqldb.getTableData(req.query.query, results => res.json(results));
});

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
