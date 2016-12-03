import express from 'express';
import path from 'path';

import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.dev';

let app = express();

// в данной секции будем подключать миделвары
app.use(webpackMiddleware(webpack(webpackConfig)));

app.get('/*', (req, res) => {
    // res.send('hello world');
    res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(3000, () => console.log('Running on localhost:3000'));
