<template>
  <div>
    <!-- video -->
    <video ref="videoRef" width="30%" playsinline autoplay mute></video>
  </div>
</template>

<script>
import { Dialog } from 'vant'
export default {
  data () {
    return {
    }
  },
  mounted () {
    // polyfill
    // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia#%E5%9C%A8%E6%97%A7%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E4%BD%BF%E7%94%A8%E6%96%B0%E7%9A%84api

    if (!navigator.mediaDevices) {
      if (!(navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
        Dialog({ message: '手机不兼容 webRTC' });
      }
      navigator.mediaDevices = {};

      if (!navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
          }
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }
    }
    const mediaDevices = navigator.mediaDevices
    // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia#%E7%A4%BA%E4%BE%8B
    mediaDevices.getUserMedia({
      audio: true,            // We want an audio track
      video: {
        aspectRatio: {
          ideal: 1.333333     // 3:2 aspect is preferred
        }
      }
    }).then(mediaStream => {
      this.playVideo(mediaStream)
      this.$emit('get-stream', mediaStream)
    }).catch(err => {
      Dialog({ message: err.message });
    })
  },
  methods: {
    playVideo (mediaStream) {
      console.log(mediaStream)
      var video = this.$refs.videoRef
      video.srcObject = mediaStream;
      // video.onloadedmetadata = function () {
      //   console.log(123)
      //   video.play();
      // };
    }
  }
}
</script>

<style>
</style>