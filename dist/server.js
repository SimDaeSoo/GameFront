"use strict";
var fs = require('fs');
var path = require('path');
var express = require('express');
var resolve = function (file) { return path.resolve(__dirname, file); };
var createBundleRenderer = require('vue-server-renderer').createBundleRenderer;
function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        runInNewContext: false
    }));
}
var template = fs.readFileSync(resolve('../src/index.template.html'), 'utf-8');
var bundle = require('./vue-ssr-server-bundle.json');
var clientManifest = require('./vue-ssr-client-manifest.json');
var renderer = createRenderer(bundle, {
    template: template,
    clientManifest: clientManifest
});
var app = express();
app.use('/dist', express.static(resolve('./dist')));
app.use('/static', express.static(resolve('./static')));
app.use('/assets', express.static(resolve('../src/assets')));
var jsons = fs.readdirSync('src/assets/jsons');
var sprites = fs.readdirSync('src/assets/sprites');
app.get('/sprites', function (req, res) {
    res.send(sprites);
});
app.get('/jsons', function (req, res) {
    res.send(jsons);
});
app.get('*', render);
function render(req, res) {
    res.setHeader("Content-Type", "text/html");
    var handleError = function (err) {
        console.log(err);
        if (err.url) {
            res.redirect(err.url);
        }
        else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found');
        }
        else {
            res.status(500).send('500 | Internal Server Error');
        }
    };
    var context = {
        title: 'title',
        url: req.url
    };
    renderer.renderToString(context, function (err, html) {
        if (err) {
            return handleError(err);
        }
        res.send(html);
    });
}
var port = 3000;
app.listen(port, function () {
    console.log("server started at " + port);
});
//# sourceMappingURL=server.js.map