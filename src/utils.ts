export function getGoogleSearchFirstImage(html) {
    const startIndex = html.indexOf('id="search"');
    if (~startIndex) {
        const [t, t1]: string[] = /\ssrc=\"(.+?)\"\s/.exec(html.slice(startIndex, -1)) || []
        return t1
    }
}

export function getGoogleSearchFirstImageUrl(html) {
    const startIndex = html.indexOf('id="search"');
    if (~startIndex) {
        const [t, t1]: string[] = /"ou":"(https.+?)"/.exec(html.slice(startIndex, -1)) || []
        return t1
    }
}