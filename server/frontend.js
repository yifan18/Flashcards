const path = require('path');
const express = require('express')
const route = require('./route')
const app = express()
const port = process.argv[process.argv.findIndex(text => text === '--port') + 1] || 80
var options = {
    dotfiles: 'ignore',
    etag: false,
    index: "index.html",
    // extensions: ['htm', 'html'],
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, '../build'), options))
route(app)
app.listen(port, () => {
    console.log(`frontend started on port ${port}!`)
});

