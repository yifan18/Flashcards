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
export function playAudio({text}){
    const word = text;
    if (!word.trim()) return;
    fetch("/speech?text=" + encodeURIComponent(word))
      .then(res => res.json())
      .then(({ path }) => {
        const audio = document.createElement('audio');
        audio.src = path;
        // audio.type = 'audio/mp3';
        audio.style.display = 'none';
        document.body.appendChild(audio)
        audio.play();
        // 播放完成销毁
        audio.addEventListener('ended', (e: Event) => {
          (e.target as HTMLAudioElement).remove()
        })
      });
}