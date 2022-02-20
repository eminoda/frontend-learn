export function getUserMedia(options = {}) {
  // polyfill
  // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia#%E5%9C%A8%E6%97%A7%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%96%B0%E7%9A%84api
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {};
    if (!navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia = function (constraints) {
        var getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
          return Promise.reject(new Error("当前设备不支持 Media"));
        }
        return new Promise(function (resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
  }
  const mediaDevices = navigator.mediaDevices;
  // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia#%E7%A4%BA%E4%BE%8B
  return mediaDevices.getUserMedia({
    audio: options.audio, // We want an audio track
    video: {
      aspectRatio: {
        ideal: 1.333333, // 3:2 aspect is preferred
      },
    },
  });
}
export function playVideo(stream, $el) {
  $el.srcObject = stream;
}
