const { Server } = require('socket.io')

const onlineUsers = []
module.exports = function (server) {
	const io = new Server(server)
	io.on('connection', (socket) => {
		console.log('scoket 已连接', socket.id)
		socket.emit('message', { type: 'update-users', data: { onlineUsers } })
		let count = 0
		socket.on('message', ({ type, data }) => {
			// console.log(type, data)
			switch (type) {
				case 'connect':
					socket.emit('message', { type: 'connect-ok' })
					const exist = onlineUsers.find((user) => user.userId == data.userId)
					if (!exist) {
						onlineUsers.push({
							userId: data.userId,
							socketId: socket.id,
						})
						socket.emit('message', { type: 'update-users', data: { onlineUsers } })
						socket.broadcast.emit('message', { type: 'update-users', data: { onlineUsers } })
					}
					healthCheck()
					break
				case 'active-connect':
					count = 0
					break
				case 'send-offer':
					var toUser = onlineUsers.find((_user) => _user.userId == data.userId)
					var fromUser = onlineUsers.find((_user) => _user.socketId == socket.id)
					// console.log(fromUser, '->', toUser)
					socket.to(toUser.socketId).emit('message', {
						type: 'receive-offer',
						data: {
							offer: data.offer,
							userId: fromUser.userId,
						},
					})
					break
				case 'send-answer':
					var toUser = onlineUsers.find((_user) => _user.userId == data.userId)
					var fromUser = onlineUsers.find((_user) => _user.socketId == socket.id)
					// console.log(fromUser, '->', toUser)
					socket.to(toUser.socketId).emit('message', {
						type: 'receive-answer',
						data: {
							answer: data.answer,
							userId: fromUser.userId,
						},
					})
					break
				case 'ice-candidate':
					var toUser = onlineUsers.find((_user) => _user.userId == data.userId)
					var fromUser = onlineUsers.find((_user) => _user.socketId == socket.id)
					console.log(fromUser, '->', toUser)
					socket.to(toUser.socketId).emit('message', {
						type: 'add-candidate',
						data: {
							candidate: data.candidate,
							userId: fromUser.userId,
						},
					})
					break
				default:
					break
			}
		})
		function healthCheck() {
			if (count < 5) {
				count++
				socket.emit('message', { type: 'check-connect' })
				setTimeout(() => {
					healthCheck()
				}, 1 * 1000)
			} else {
				// remove
				for (let i = 0; i < onlineUsers.length; i++) {
					console.log('移除', onlineUsers[i])
					onlineUsers.splice(i, 1)
					socket.broadcast.emit('message', { type: 'update-users', data: { onlineUsers } })
					break
				}
			}
		}
	})
}
