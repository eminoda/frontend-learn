var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		socket: null,
		onlineUsers: [],
		currentId: '',
		peerConnection: null,
		answerPC: null,
		stream: '',
	},
	methods: {
		addUser() {
			this.currentId = Date.now()
			this.socket.emit('message', { type: 'connect', data: { userId: this.currentId } })
			navigator.mediaDevices
				.getUserMedia({
					audio: false, // We want an audio track
					video: {
						aspectRatio: {
							ideal: 1.333333, // 3:2 aspect is preferred
						},
					},
				})
				.then((stream) => {
					this.stream = stream
					this.$refs.sourceVideoRef.srcObject = stream
				})
				.catch((err) => {
					this.$message.error('媒体设备获取失败', err.message)
				})
		},
		toCall(user) {
			// this.peerConnection = new RTCPeerConnection({ iceServers: [{ url: 'stun:stun.l.google.com:19302' }] })
			this.peerConnection = new RTCPeerConnection()

			if (!this.stream) {
				this.$message.error('媒体流不存在')
			}

			console.log('添加多媒体流到 track')
			this.stream.getTracks().forEach((track) => {
				this.peerConnection.addTrack(track, this.stream)
			})

			// 定义 pc 事件
			this.peerConnection.onicecandidate = (event) => {
				// candidate: 'candidate:1667339315 1 tcp 1518280447 192.168.31.28 9 typ host tcptype active generation 0 ufrag iP/D network-id 1 network-cost 10',
				// sdpMid: '0',
				// sdpMLineIndex: 0
				console.log('local onicecandidate')
				// if (event.candidate) {
				// 	this.socket.emit('message', {
				// 		type: 'ice-candidate',
				// 		data: {
				// 			to: user.userId,
				// 			candidate: event.candidate,
				// 		},
				// 	})
				// }
			}
			this.peerConnection.ontrack = (event) => {
				console.log('ontrack', event.streams)
				this.$refs.answerVideoRef.srcObject = event.streams[0]
			}

			// 准备数据
			this.peerConnection
				.createOffer()
				.then((offer) => {
					/**
					 * RTCSessionDescription
					 * {
					 *    type:'offer',
					 *    sdp: "v=0\r\no=- 7064786581258736929 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS kCt1CAkR2KN6PPpGbwO21AOc0uUNqfofAX4J\r\nm=video 9 UDP/TLS/RTP/SAVPF 96 97 98 99 100 101 102 121 127 120 125 107 108 109 124 119 123 117 35 36 114 115 116 62 118\r\nc=IN IP4 0.0.0.0\r\na=rtcp:9 IN IP4 0.0.0.0\r\na=ice-ufrag:oEk+\r\na=ice-pwd:OELmd1+uXSOtBCb9sdKxl/Ii\r\na=ice-options:trickle\r\na=fingerprint:sha-256 3B:8D:6A:D4:58:8F:D3:19:58:F8:28:A2:5B:3A:02:54:B3:11:95:F3:9B:59:4C:59:38:60:13:D0:DA:4F:49:27\r\na=setup:actpass\r\na=mid:0\r\na=extmap:1 urn:ietf:params:rtp-hdrext:toffset\r\na=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\na=extmap:3 urn:3gpp:video-orientation\r\na=extmap:4 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\na=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\na=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\na=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\na=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/color-space\r\na=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\na=extmap:10 urn:ietf:params:rtp-hdrext:sdes:rtp-stream-id\r\na=extmap:11 urn:ietf:params:rtp-hdrext:sdes:repaired-rtp-stream-id\r\na=sendrecv\r\na=msid:kCt1CAkR2KN6PPpGbwO21AOc0uUNqfofAX4J 5b01ca12-366e-4965-a7f6-0d7c034383a3\r\na=rtcp-mux\r\na=rtcp-rsize\r\na=rtpmap:96 VP8/90000\r\na=rtcp-fb:96 goog-remb\r\na=rtcp-fb:96 transport-cc\r\na=rtcp-fb:96 ccm fir\r\na=rtcp-fb:96 nack\r\na=rtcp-fb:96 nack pli\r\na=rtpmap:97 rtx/90000\r\na=fmtp:97 apt=96\r\na=rtpmap:98 VP9/90000\r\na=rtcp-fb:98 goog-remb\r\na=rtcp-fb:98 transport-cc\r\na=rtcp-fb:98 ccm fir\r\na=rtcp-fb:98 nack\r\na=rtcp-fb:98 nack pli\r\na=fmtp:98 profile-id=0\r\na=rtpmap:99 rtx/90000\r\na=fmtp:99 apt=98\r\na=rtpmap:100 VP9/90000\r\na=rtcp-fb:100 goog-remb\r\na=rtcp-fb:100 transport-cc\r\na=rtcp-fb:100 ccm fir\r\na=rtcp-fb:100 nack\r\na=rtcp-fb:100 nack pli\r\na=fmtp:100 profile-id=2\r\na=rtpmap:101 rtx/90000\r\na=fmtp:101 apt=100\r\na=rtpmap:102 H264/90000\r\na=rtcp-fb:102 goog-remb\r\na=rtcp-fb:102 transport-cc\r\na=rtcp-fb:102 ccm fir\r\na=rtcp-fb:102 nack\r\na=rtcp-fb:102 nack pli\r\na=fmtp:102 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\na=rtpmap:121 rtx/90000\r\na=fmtp:121 apt=102\r\na=rtpmap:127 H264/90000\r\na=rtcp-fb:127 goog-remb\r\na=rtcp-fb:127 transport-cc\r\na=rtcp-fb:127 ccm fir\r\na=rtcp-fb:127 nack\r\na=rtcp-fb:127 nack pli\r\na=fmtp:127 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\na=rtpmap:120 rtx/90000\r\na=fmtp:120 apt=127\r\na=rtpmap:125 H264/90000\r\na=rtcp-fb:125 goog-remb\r\na=rtcp-fb:125 transport-cc\r\na=rtcp-fb:125 ccm fir\r\na=rtcp-fb:125 nack\r\na=rtcp-fb:125 nack pli\r\na=fmtp:125 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\na=rtpmap:107 rtx/90000\r\na=fmtp:107 apt=125\r\na=rtpmap:108 H264/90000\r\na=rtcp-fb:108 goog-remb\r\na=rtcp-fb:108 transport-cc\r\na=rtcp-fb:108 ccm fir\r\na=rtcp-fb:108 nack\r\na=rtcp-fb:108 nack pli\r\na=fmtp:108 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\na=rtpmap:109 rtx/90000\r\na=fmtp:109 apt=108\r\na=rtpmap:124 H264/90000\r\na=rtcp-fb:124 goog-remb\r\na=rtcp-fb:124 transport-cc\r\na=rtcp-fb:124 ccm fir\r\na=rtcp-fb:124 nack\r\na=rtcp-fb:124 nack pli\r\na=fmtp:124 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=4d001f\r\na=rtpmap:119 rtx/90000\r\na=fmtp:119 apt=124\r\na=rtpmap:123 H264/90000\r\na=rtcp-fb:123 goog-remb\r\na=rtcp-fb:123 transport-cc\r\na=rtcp-fb:123 ccm fir\r\na=rtcp-fb:123 nack\r\na=rtcp-fb:123 nack pli\r\na=fmtp:123 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=4d001f\r\na=rtpmap:117 rtx/90000\r\na=fmtp:117 apt=123\r\na=rtpmap:35 AV1/90000\r\na=rtcp-fb:35 goog-remb\r\na=rtcp-fb:35 transport-cc\r\na=rtcp-fb:35 ccm fir\r\na=rtcp-fb:35 nack\r\na=rtcp-fb:35 nack pli\r\na=rtpmap:36 rtx/90000\r\na=fmtp:36 apt=35\r\na=rtpmap:114 H264/90000\r\na=rtcp-fb:114 goog-remb\r\na=rtcp-fb:114 transport-cc\r\na=rtcp-fb:114 ccm fir\r\na=rtcp-fb:114 nack\r\na=rtcp-fb:114 nack pli\r\na=fmtp:114 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=640032\r\na=rtpmap:115 rtx/90000\r\na=fmtp:115 apt=114\r\na=rtpmap:116 red/90000\r\na=rtpmap:62 rtx/90000\r\na=fmtp:62 apt=116\r\na=rtpmap:118 ulpfec/90000\r\na=ssrc-group:FID 2463659127 3445327717\r\na=ssrc:2463659127 cname:b8qsNPTgO/gaXMgB\r\na=ssrc:2463659127 msid:kCt1CAkR2KN6PPpGbwO21AOc0uUNqfofAX4J 5b01ca12-366e-4965-a7f6-0d7c034383a3\r\na=ssrc:2463659127 mslabel:kCt1CAkR2KN6PPpGbwO21AOc0uUNqfofAX4J\r\na=ssrc:2463659127 label:5b01ca12-366e-4965-a7f6-0d7c034383a3\r\na=ssrc:3445327717 cname:b8qsNPTgO/gaXMgB\r\na=ssrc:3445327717 msid:kCt1CAkR2KN6PPpGbwO21AOc0uUNqfofAX4J 5b01ca12-366e-4965-a7f6-0d7c034383a3\r\na=ssrc:3445327717 mslabel:kCt1CAkR2KN6PPpGbwO21AOc0uUNqfofAX4J\r\na=ssrc:3445327717 label:5b01ca12-366e-4965-a7f6-0d7c034383a3\r\n"
					 *  }
					 */
					this.peerConnection.setLocalDescription(new RTCSessionDescription(offer))
					console.log('local offer desc ok')
					this.$notify.success('创建 offer 成功')
					this.socket.emit('message', {
						type: 'send-offer',
						data: {
							offer,
							userId: user.userId,
						},
					})
				})
				.catch((err) => {
					this.$message.error('创建 offer 失败')
				})
		},
	},
	created() {
		this.socket = io('wss://192.168.31.28:3000')

		this.socket.on('message', ({ type, data }) => {
			console.log(type, data)
			switch (type) {
				case 'connect-ok':
					this.$notify({
						title: '提示',
						message: '连接创建成功',
					})
					break
				case 'update-users':
					for (const user of data.onlineUsers) {
						const exist = this.onlineUsers.find((_user) => _user.userId == user.userId)
						if (!exist) {
							this.onlineUsers.push(user)
						}
					}
					break
				case 'check-connect':
					this.socket.emit('message', { type: 'active-connect' })
					break
				case 'receive-offer':
					this.answerPC = new RTCPeerConnection()
					this.stream.getTracks().forEach((track) => {
						this.answerPC.addTrack(track, this.stream)
					})
					this.answerPC.onicecandidate = (event) => {
						// candidate: 'candidate:1667339315 1 tcp 1518280447 192.168.31.28 9 typ host tcptype active generation 0 ufrag iP/D network-id 1 network-cost 10',
						// sdpMid: '0',
						// sdpMLineIndex: 0
						console.log('remote candidate')
						if (event.candidate) {
							this.socket.emit('message', {
								type: 'ice-candidate',
								data: {
									userId: data.userId,
									candidate: event.candidate,
								},
							})
						}
					}
					this.answerPC.setRemoteDescription(new RTCSessionDescription(data.offer))
					console.log('remote offer desc ok')

					this.answerPC.createAnswer().then((answer) => {
						this.answerPC.setLocalDescription(new RTCSessionDescription(answer))
						console.log('local answer desc ok')
						this.$notify.success('创建 answer 成功')
						this.socket.emit('message', {
							type: 'send-answer',
							data: {
								answer,
								userId: data.userId,
							},
						})
					})
					break
				case 'receive-answer':
					this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
					console.log('remote answer desc ok')
					break
				case 'add-candidate':
					this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
				default:
					break
			}
		})
	},
})
