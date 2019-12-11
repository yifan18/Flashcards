const Koa = require('koa');
const serve = require('koa-static');
const generateAudio = require('./text-to-speech').generateAudio;
const app = new Koa();

app.use(serve('asserts', opts));
// response
app.use(ctx => {
    const req = ctx.request;
    const res = ctx.response;
    const path = req.path
    if (path.startsWith('/proxy')) {
        const url = decodeURIComponent(req.query.url)
        console.log('url ==> ', url)
        http.get(url, function (_res) {
            _res.addListener('data', function (chunk) {
                res.write(chunk)
            })
            _res.addListener('end', function () {
                res.end()
            })
        });
        return;
    }
    if (path.startsWith('/speech')) {
        const text = decodeURIComponent(req.query.text)
        console.log('word ==> ', text)

        generateAudio({ text }).then((relativePath) => {
            res.status(200).json({ path: relativePath })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
        return;
    }
});

app.listen(3000);