// TODO: 이게 js지, ts냐? 똑바로 type 지정 및 typescript로 변환좀 하자. 2019.01.29 SDS
const fs = require('fs');
const path = require('path');
const express = require('express');
const resolve = (file: any) => path.resolve(__dirname, file);
const { createBundleRenderer } = require('vue-server-renderer');

function createRenderer(bundle: any, options: any) {
    return createBundleRenderer(bundle, Object.assign(options, {
        runInNewContext: false
    }));
}

// TODO: SSR Flow 확실하게 숙지하여보자. 음.. 상당히 어렵다.
const template = fs.readFileSync(resolve('../src/index.template.html'), 'utf-8');
const bundle = require('./vue-ssr-server-bundle.json');
const clientManifest = require('./vue-ssr-client-manifest.json');

const renderer: any = createRenderer(bundle, {
    template,
    clientManifest
});

// TODO: 앞으로 Gzip 적용하게 되면서 아마 js gzip 속성임을 content-type에 명시해 줘야 할것 이다.
const app = express();

app.use('/dist', express.static(resolve('./dist')));
app.use('/static', express.static(resolve('./static')));
// app.use('/assets', express.static(resolve('../src/assets')));


// 에바야.. TODO : 서버를 구성해 본적이 없으니.. 이런식으로 밖에 구성을 못하는 모습을 보니.. 한숨밖에 안나온다.. 새로 잘 짤것.. 리팩토링좀 하고.. 잘 짜여진 양식좀 볼것..
// 음.. 어떻게 만들어야 할까 모르겠다.. 사실 서버부분 인데.. Back-End를 구분하지 않았으니.. 이렇게라도 보내야겠지..?
// const jsons: Array<string> = fs.readdirSync('src/assets/jsons');
// const sprites: Array<string> = fs.readdirSync('src/assets/sprites');

// app.get('/sprites', (req: any, res: any) => {
//     res.send(sprites);
// });

// app.get('/jsons', (req: any, res: any) => {
//     res.send(jsons);
// });

app.get('*', render);

function render(req: any, res: any) {

    res.setHeader("Content-Type", "text/html");

    const handleError = (err: any) => {
        console.log(err);
        if (err.url) {
            res.redirect(err.url);
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found');
        } else {
            res.status(500).send('500 | Internal Server Error');
        }
    }

    const context = {
        title: 'title',
        url: req.url
    }

    renderer.renderToString(context, (err: any, html: any) => {
        if (err) {
            return handleError(err);
        }
        res.send(html);
    });
}

const port = 3000;

app.listen(port, () => {
    console.log(`server started at ${port}`)
})