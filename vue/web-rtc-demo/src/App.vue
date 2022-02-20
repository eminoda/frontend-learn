<template>
  <div id="app">
    <RTC @get-stream="handleStream" />
    <Socket
      @answer-made="handleAddTransceiver"
      ref="rtcRef"
      @track="handleTrack"
    />
    <video ref="videoRemoteRef" width="50%" playsinline autoplay></video>
  </div>
</template>

<script>

import RTC from './components/RTC'
import Socket from './components/Socket'
export default {
  name: 'App',
  components: {
    RTC, Socket
  },
  data () {
    return {
      webcamStream: null,
      myPeerConnection: null
    }
  },
  methods: {
    handleTrack (event) {
      const remoteVideo = this.$refs.videoRemoteRef;
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.onloadedmetadata = function () {
          remoteVideo.play();
        };
      }
    },
    async handleStream (webcamStream) {
      this.webcamStream = webcamStream
      if (this.webcamStream) {
        this.$refs.rtcRef.createRTCPeerConn(this.webcamStream)
      }
    },
    async handleAddTransceiver (myPeerConnection) {
      try {
        console.log(this.webcamStream.getTracks(), myPeerConnection)
        this.webcamStream.getTracks().forEach(
          track => {
            myPeerConnection.addTrack(track, this.webcamStream)
            console.log('addTrack ok')
          }
        );
        // const remoteConnection = new RTCPeerConnection({
        //   offerToReceiveAudio: true,
        //   offerToReceiveVideo: true
        // });
        // myPeerConnection.onicecandidate = e => {
        //   remoteConnection.addIceCandidate(e.candidate).then(() => {
        //     console.log('addIceCandidate ok')
        //   }).catch(err => {
        //     console.log('addIceCandidate', err.message)
        //   })
        // };
        // remoteConnection.addEventListener('track', function ({ streams: [stream] }) {
        //   console.log('track', stream)
        //   const remoteVideo = this.$refs.videoRemoteRef;
        //   if (remoteVideo) {
        //     remoteVideo.srcObject = stream;
        //   }
        // });
        console.log(myPeerConnection)
      } catch (err) { console.log(err) }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
