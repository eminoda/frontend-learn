<template>
  <div>
    <div>---{{ peerConnection }}---</div>
    <div>当前设备{{ socketId }}</div>
    <div v-for="item in users" :key="item" @click="callUser(item)">
      {{ item }}
    </div>
  </div>
</template>

<script>
import io from 'socket.io/client-dist/socket.io.js';
export default {
  components: {},
  data () {
    return {
      users: [],
      socket: null,
      peerConnection: null,
      remoteConnection: null,
      socketId: '',
      toSocketID: ''
    }
  },
  methods: {
    async callUser (socketId) {
      this.toSocketID = socketId
      try {
        const offer = await this.localCreateOffer()
        await this.setLocalDesc(offer, this.peerConnection)
        this.socket.emit("call-user", {
          offer,
          to: socketId
        });
      } catch (err) { console.log(err) }
    },
    async TtestCall () {
      // 创建本地多媒体 sdp (Session Description Protocol) 
      const offer = await this.localCreateOffer()
      await this.setLocalDesc(offer, this.peerConnection)
      await this.setRemoteDesc(offer, this.remoteConnection)

      // 远程应答
      const answer = await this.remoteCreateAnswer();
      await this.setLocalDesc(answer, this.remoteConnection)
      await this.setRemoteDesc(answer, this.peerConnection)
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
    addTrack (stream) {
      // 加载媒体流
      stream.getTracks().forEach(
        track => {
          console.log('getTracks', stream)
          this.peerConnection.addTrack(track, stream)
        }
      );
    },
    createRTCPeerConn (stream) {
      try {
        console.log('创建 RTC')
        const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
        this.peerConnection = new RTCPeerConnection({ 'iceServers': [{ 'url': 'stun:stun.services.mozilla.com' }] })
        // this.remoteConnection = new RTCPeerConnection({ 'iceServers': [{ 'url': 'stun:stun.services.mozilla.com' }] });
        // local
        this.peerConnection.onicecandidate = event => {
          if (event.candidate) {
            this.socket.emit("new-ice-candidate", {
              to: this.toSocketID,
              candidate: event.candidate
            });
          }
        }
        this.peerConnection.ontrack = (event) => {
          this.$emit('track', event)
        };
        this.addTrack(stream)
        // this.TtestCall()
      } catch (err) {
        console.log(err.message)
      }
    }
  },
  created () {
    this.socket = io(location.host, { path: '/ws/socket.io' });
    this.socket.on('current-user', ({ socketId }) => {
      this.socketId = socketId
    })
    this.socket.on("update-user-list", ({ users }) => {
      console.log('更新 users 列表')
      for (let i = 0; i < users.length; i++) {
        if (!this.users.find(item => item == users[i])) {
          this.users.push(users[i])
        }
      }
    });
    this.socket.on("remove-user", ({ socketId }) => {
      console.log(socketId, 88)
      for (let i = 0; i < this.users.length; i++) {
        if (socketId == this.users[i]) {
          this.users.splice(i, 1);
        }
      }
    });
    this.socket.on("call-made", async data => {
      console.log('call-made', data.socket)
      this.toSocketID = data.socket
      await this.setRemoteDesc(data.offer, this.peerConnection)
      const answer = await this.remoteCreateAnswer();
      await this.setLocalDesc(answer, this.peerConnection)

      this.socket.emit("make-answer", {
        answer,
        to: data.socket
      });
    });
    this.socket.on("answer-made", async data => {
      console.log('answer-made')
      await this.setRemoteDesc(data.answer, this.peerConnection)
      // this.$emit('answer-made', this.peerConnection)
    });
    this.socket.on('candidate-done', async data => {
      this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
        console.log('remote addIceCandidate ok')
      }).catch(err => {
        console.log('remote addIceCandidate [error]', err.message)
      })
    })
  }
}

</script>

<style>
</style>