// const Koa = require('koa');
// const serve = require('koa-static');
const http = require('http');
const path = require('path');
const generateAudio = require('./text-to-speech').generateAudio;
const express = require('express')
const app = express()
const port = process.argv[process.argv.findIndex(text => text === '--port') + 1] || 3000
var options = {
    dotfiles: 'ignore',
    etag: false,
    // extensions: ['htm', 'html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}
app.use('/audios', express.static(path.join(__dirname, 'audios'), options))
app.get('*', (req, res) => {
    const path = req.path
    console.log('visit ==>', path)
    if (path.startsWith('/proxy')) {
        const url = decodeURIComponent(req.query.url)
        console.log('url ==>', url)
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
        console.log('word ==>', text)

        generateAudio({ text }).then((relativePath) => {
            res.status(200).json({ path: relativePath })
        }).catch(err => {
            res.status(500).json({ error: err })
        })
        return;
    }
});

app.listen(port, () => {
    console.log(`services started on port ${port}!`)
});