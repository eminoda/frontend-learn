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
      return p.setLocalDescription(offer)
    },
    async setRemoteDesc (offer, p) {
      return p.setRemoteDescription(offer)
    },
    async remoteCreateAnswer () {
      return this.remoteConnection.createAnswer()
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
        this.peerConnection = new RTCPeerConnection(null)
        this.remoteConnection = new RTCPeerConnection(null);
        // local
        this.peerConnection.onicecandidate = event => {
          this.remoteConnection.addIceCandidate(event.candidate).then(() => {
            console.log('remote addIceCandidate ok')
          }).catch(err => {
            console.log('remote addIceCandidate [error]', err.message)
          })
        }
        // remote
        this.remoteConnection.onicecandidate = event => {
          this.peerConnection.addIceCandidate(event.candidate).then(() => {
            console.log('local addIceCandidate ok')
          }).catch(err => {
            console.log('local addIceCandidate [error]', err.message)
          })
        }
        // this.peerConnection.oniceconnectionstatechange = event => {
        //   console.log('local ice change', event)
        // }
        // this.remoteConnection.oniceconnectionstatechange = event => {
        //   console.log('remote ice change', event)
        // }
        this.remoteConnection.ontrack = (event) => {
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
  }
}
</script>

<style>
</style>