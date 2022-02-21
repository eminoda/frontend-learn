<template>
  <div id="app">
    <van-row justify="space-between" :gutter="10">
      <van-col span="10">
        <!-- 视频1 -->
        <video ref="videoRef" width="100%" playsinline autoplay mute></video>
      </van-col>
      <van-col span="10">
        <!-- 视频2 -->
        <video ref="videoRemoteRef" width="100%" playsinline autoplay></video>
      </van-col>
    </van-row>
    <van-button @click="startCall">call</van-button>
    <div>
      <van-cell
        v-for="item in users"
        :key="item"
        :title="'socketId:' + item"
        @click="callUser(item)"
      >
        <template #title>
          <span style="margin-right:10px;">socketId:{{ item }}</span>
          <van-tag type="primary" v-if="item == socketId">当前设备</van-tag>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import io from 'socket.io/client-dist/socket.io.js';
import { getUserMedia, playVideo } from './utils'
import { Dialog, Notify } from 'vant'
// import Socket from './components/Socket'
export default {
  name: 'App',
  components: {
    // Socket
  },
  data () {
    return {
      socketId: '',
      webcamStream: null,
      socket: null,
      users: [],
      peerConnection: null,
      toSocketID: ''
    }
  },
  methods: {
    async handleStream (webcamStream) {
      this.webcamStream = webcamStream
      if (this.webcamStream) {
        this.$refs.rtcRef.createRTCPeerConn(this.webcamStream)
      }
    },
    async createPeerConnection () {
      // 获取媒体流
      const originStream = await getUserMedia({ audio: false })
      playVideo(originStream, this.$refs.videoRef)
      // 创建 pc
      this.peerConnection = new RTCPeerConnection({ 'iceServers': [{ 'url': 'stun:stun.services.mozilla.com' }] })
      // 定义 pc 事件
      this.peerConnection.onicecandidate = (event) => {
        console.log('onicecandidate');
      }
      this.peerConnection.ontrack = (event) => {
        console.log('ontrack')
        playVideo(event.streams[0], this.$refs.videoRemoteRef)
      }
      // 加载媒体流
      originStream.getTracks().forEach(
        track => {
          this.peerConnection.addTrack(track, stream)
        }
      );
    },
    async callUser (socketId) {
      if (socketId == this.socketId) {
        Dialog({ message: '请选择其他 socketId' });
        return
      }
      this.toSocketID = socketId
      try {
        const offer = await this.localCreateOffer()
        await this.setLocalDesc(offer, this.peerConnection)
        this.socket.emit("call-user", {
          offer,
          to: socketId
        });
        Notify({ type: 'primary', message: '发起呼叫 ' + socketId });
      } catch (err) { console.log(err) }
    },
    async localCreateOffer () {
      return this.peerConnection.createOffer()
    },
    async setLocalDesc (offer, p) {
      return p.setLocalDescription(new RTCSessionDescription(offer))
    },
    async setRemoteDesc (offer, p) {
      return p.setRemoteDescription(new RTCSessionDescription(offer))
    },
    async remoteCreateAnswer () {
      return this.peerConnection.createAnswer()
    },
  },
  async mounted () {
    console.log('start')
    // 创建 socket 链接
    this.socket = io({ path: '/ws/socket.io' });
    // this.peerConnectionListen(originStream)
    this.socket.on('current-user', ({ socketId }) => {
      this.socketId = socketId
    })
    this.socket.on("update-user-list", ({ users }) => {
      for (let i = 0; i < users.length; i++) {
        if (!this.users.find(item => item == users[i])) {
          this.users.push(users[i])
        }
      }
    });
    this.socket.on("remove-user", ({ socketId }) => {
      for (let i = 0; i < this.users.length; i++) {
        if (socketId == this.users[i]) {
          this.users.splice(i, 1);
        }
      }
    });
    this.socket.on("call-made", async data => {
      Notify({ type: 'success', message: '收到呼叫 ok' });
      this.toSocketID = data.socket
      await this.setRemoteDesc(data.offer, this.peerConnection)
      const answer = await this.remoteCreateAnswer();
      await this.setLocalDesc(answer, this.peerConnection)
      this.socket.emit("make-answer", {
        answer,
        to: data.socket
      });
      Notify({ type: 'primary', message: '发起应答' });
    });
    this.socket.on("answer-made", async data => {
      await this.setRemoteDesc(data.answer, this.peerConnection)
      Notify({ type: 'success', message: '收到应答' });
    });
    this.socket.on('candidate-done', async data => {
      console.log(11111111111)
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
    })
    this.createPeerConnection()
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
