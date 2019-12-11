import config from "./config";
export function getGoogleSearchFirstImage(html) {
  const startIndex = html.indexOf('id="search"');
  if (~startIndex) {
    const [t, t1]: string[] =
      /\ssrc=\"(.+?)\"\s/.exec(html.slice(startIndex, -1)) || [];
    return t1;
  }
}

export function getGoogleSearchFirstImageUrl(html) {
  const startIndex = html.indexOf('id="search"');
  if (~startIndex) {
    const [t, t1]: string[] =
      /"ou":"(https.+?)"/.exec(html.slice(startIndex, -1)) || [];
    return t1;
  }
}
export function playAudio({ text }) {
  const word = text;
  if (!word.trim()) return;
  serviceGet("/speech?text=" + encodeURIComponent(word))
    .then(res => res.json())
    .then(({ path }) => {
      const audio = document.createElement("audio");
      audio.src = config.SERVICE_ADDRESS + path;
      // audio.type = 'audio/mp3';
      audio.style.display = "none";
      document.body.appendChild(audio);
      audio.play();
      // 播放完成销毁
      audio.addEventListener("ended", (e: Event) => {
        (e.target as HTMLAudioElement).remove();
      });
    });
}
export function serviceGet(path: string, opts?: any) {
  path = path.startsWith("/") ? path.slice(1) : path;
  return fetch(config.SERVICE_ADDRESS + path, opts);
}
