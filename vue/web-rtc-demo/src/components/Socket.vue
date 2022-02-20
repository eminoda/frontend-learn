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
      socketId: '',
    }
  },
  methods: {
    async callUser (socketId) {
      try {
        const { RTCSessionDescription } = window;
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

        this.socket.emit("call-user", {
          offer,
          to: socketId
        });
      } catch (err) { console.log(err) }
      // this.$emit('call-user', { socket: this.socket, socketId, peerConnection: this.peerConnection })
    },
    createRTCPeerConn () {
      try {
        const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
        this.peerConnection = new RTCPeerConnection()
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
      this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer) //peerConnection.createOffer()
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      this.socket.emit("make-answer", {
        answer,
        to: data.socket
      });
    });
    this.socket.on("answer-made", async data => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      this.$emit('answer-made', this.peerConnection)
    });
    this.createRTCPeerConn()
  }
}
</script>

<style>
</style>