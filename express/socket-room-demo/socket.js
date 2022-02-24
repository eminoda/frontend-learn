const { Server } = require('socket.io');

const onlineSocket = []
module.exports = function (server) {
  const io = new Server(server);
  io.on('connection', (socket) => {
    console.log('scoket 已连接', socket.id);
    socket.on('message', ({ type, data }) => {
      socket.join(data.room);
      socket.to(data.room).emit('room', 2);
    });
  });
};
