const http = require('http')
const { connectDB, DB_NAME, STORE_CARD, STORE_SETTING, openCard, openSetting } = require('../server/db');
connectDB(DB_NAME).then(async ({ db, close }) => {
    const card = openCard(db, STORE_CARD);
    const list = await card.query({});
    console.log('ready to downloading image...');


    function next(i, cb) {
        if (i === list.length) return cb();
        const item = list[i];
        console.log(`progress: ${i}`)
        if (!item.picture) {
            new Promise(resolve => {
                const url = `http://www.google.com/search?q=${item.front}&tbm=isch`;
                // console.log('1')
                http.get(url, res => {
                    let rawData = ''
                    res.on('data', (chunk) => { rawData += chunk; });
                    res.on('end', () => {
                        // console.log('2')
                        try {
                            const imgUrl = getGoogleSearchFirstImageUrl(rawData);
                            card.modify({ id: item.id, picture: imgUrl });
                            resolve();
                        } catch (e) {
                            console.error(`failure: ${i}`);
                            reject()
                        } finally {
                            next(i + 1, cb)
                        }
                    });
                    res.on('error', err => {
                        console.err(err.message)
                        next(i + 1, cb)
                    })
                })
                // console.log('4')
            })
        }else{
            next(i + 1, cb)
        }
    }

    next(0, close)
})


function getGoogleSearchFirstImageUrl(html) {
    const startIndex = html.indexOf('id="search"');
    if (~startIndex) {
        const [t, t1] =
            /\ssrc=\"(.+?)\"\s/.exec(html.slice(startIndex, -1)) || [];
        return t1;
    }
}