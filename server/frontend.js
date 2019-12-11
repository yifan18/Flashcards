const path = require('path');
const express = require('express')
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
app.use(express.static(path.join(__dirname, '../build'), options))
app.listen(port, () => {
    console.log(`frontend started on port ${port}!`)
});