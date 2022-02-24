<template>
  <div>
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
    <div>当前登录人 {{ userId }}</div>
    <div>
      <div>当前所有用户</div>
      <van-cell v-for="item in userIds" :key="item" :title="item">
        <template #right-icon>
          <van-button @click="startCall(item)" :disabled="userId == item"
            >呼叫他</van-button
          >
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import io from 'socket.io/client-dist/socket.io.js';
import { getUserMedia, playVideo } from './utils'

export default {
  data () {
    return {
      userId: '',
      userIds: [],
      toUserId: '',
      socket: null,
      stream: ''
    }
  },
  methods: {
    createSocketConnect () {
      this.socket = io({ path: '/ws/socket.io' });
      // this.peerConnectionListen(originStream)
      this.socket.on('message', async ({ type, data }) => {
        console.log('==>socket', type, data)
        if (type == 'connection') {
          this.userId = data.userId
        } else if (type == 'update-user-list') {
          for (let i = 0; i < data.userIds.length; i++) {
            const userId = data.userIds[i]
            if (!this.userIds.find(item => item == userId)) {
              this.userIds.push(userId)
            }
          }
        } else if (type == 'remove-user') {
          for (let i = 0; i < this.userIds.length; i++) {
            if (data.userId == this.userIds[i]) {
              this.users.splice(i, 1);
            }
          }
        } else if (type == 'call-made') {
          // this.peerConnection = new RTCPeerConnection({ 'iceServers': [{ 'url': 'stun:global.stun.twilio.com:3478?transport=udp' }] })


          // this.peerConnection.onicecandidate = (event) => {
          //   console.log('remote onicecandidate');
          //   if (event.candidate) {
          //     this.socket.emit("message", {
          //       type: 'new-ice-candidate',
          //       data: {
          //         to: data.from,
          //         candidate: event.candidate
          //       }
          //     });
          //   }
          // }
          this.toUserId = data.from
          const { offer } = data
          console.log('set remote desc offer')
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
          console.log('create answer')
          const answer = await this.peerConnection.createAnswer()
          console.log('set local desc answer')
          await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer))
          this.socket.emit("message", {
            type: 'make-answer',
            data: {
              answer,
              to: data.from,
              from: this.userId
            }
          });
        } else if (type == "answer-made") {
          console.log('set remote desc answer')
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
        } else if (type == 'candidate-done') {
          console.log('candidate-done')
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
        }
      })
    },
    async startCall (toUserId) {
      this.toUserId = toUserId
      this.createPeerConnection(toUserId)
    },
    async createPeerConnection (toUserId) {
      console.log('创建 peerConnection')

      // 开始创建连接
      console.log('create offer')
      const offer = await this.peerConnection.createOffer()
      console.log('set local desc offer')
      await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer))

      this.socket.emit('message', {
        type: 'call-user',
        data: {
          offer,
          to: toUserId,
          from: this.userId
        }
      })
    }
  },
  async created () {
    this.createSocketConnect()
    this.stream = await getUserMedia({ audio: true })
    playVideo(this.stream, this.$refs.videoRef)
    this.peerConnection = new RTCPeerConnection({ 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }] })
    if (this.stream) {
      console.log('添加多媒体流到 track')
      this.stream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.stream)
      })
    }
    // 定义 pc 事件
    this.peerConnection.onicecandidate = (event) => {
      console.log('onicecandidate', event.candidate);
      if (event.candidate) {
        this.socket.emit("message", {
          type: 'new-ice-candidate',
          data: {
            to: this.toUserId,
            candidate: event.candidate
          }
        });
      }
    }
    this.peerConnection.ontrack = (event) => {
      console.log('ontrack')
      playVideo(event.streams[0], this.$refs.videoRemoteRef)
    }
  }
}
</script>

<style>
</style>