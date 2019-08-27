const fs = require('fs');
const path = require('path');


const ghtml = fs.readFileSync(path.resolve(__dirname, 'g.html')).toString();

const startIndex = ghtml.indexOf('id="search"');
if (~startIndex) {
    // console.log(ghtml.slice(startIndex).match(/\ssrc=\"(.+?)\"\s/g))
    const [t, t1] = /\ssrc=\"(.+?)\"\s/.exec(ghtml.slice(startIndex, ghtml.length - 1))

    // console.log(t, t1)

    // console.log(new RegExp('\\ssrc=\\".+\\"\\s', 'g').exec(ghtml.slice(startIndex)))
}

function getGoogleSearchFirstImage(html) {
    const startIndex = html.indexOf('id="search"');
    if (~startIndex) {
        const [t, t1] = /\ssrc=\"(.+?)\"\s/.exec(ghtml.slice(startIndex, ghtml.length - 1)) || []
        return t1
    }
}

function getGoogleSearchFirstImageUrl(html) {
    const startIndex = html.indexOf('id="search"');
    if (~startIndex) {
        const [t, t1] = /"ou":"(https.+?)"/.exec(ghtml.slice(startIndex, -1)) || []
        return t1
    }
}

console.log(getGoogleSearchFirstImageUrl(ghtml))

// var re = /quick\s(brown).+?(jumps)/ig;
// var result = re.exec('The Quick Brown Fox Jumps Over The Lazy Dog');
// console.log(result)