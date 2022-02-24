"use strict";
const http = require("http");
const https = require("https");
const fs = require("fs");
const app = require("../app");
const key = fs.readFileSync("./ssl/ca.key");
const cert = fs.readFileSync("./ssl/ca.crt");
const { Server } = require("socket.io");

/**
 * Create HTTP server.
 */
// const server = http.createServer(app);
const server = https.createServer({ key, cert }, app);
const io = new Server(server);

const onlineUsers = [];

io.on("connection", (socket) => {
  const userId = Date.now();
  console.log("user", userId, "is comeing");
  socket.emit("message", {
    type: "connection",
    data: {
      userId,
    },
  });
  const existUser = onlineUsers.find((item) => item == userId);
  if (!existUser) {
    onlineUsers.push({ userId, socketId: socket.id });
    socket.broadcast.emit("message", {
      type: "update-user-list",
      data: {
        userIds: onlineUsers.map((item) => item.userId),
      },
    });
    socket.emit("message", {
      type: "update-user-list",
      data: {
        userIds: onlineUsers.map((item) => item.userId),
      },
    });
  }
  socket.on("disconnect", () => {
    for (let i = 0; i < onlineUsers.length; i++) {
      const { userId, socketId } = onlineUsers[i];
      if (socket.id == socketId) {
        onlineUsers.splice(i, 1);
      }
    }
    socket.broadcast.emit("remove-user", {
      userId,
    });
  });
  socket.on("message", ({ type, data }) => {
    console.log({ type, from: data.from, to: data.to });
    if (type == "call-user") {
      const { socketId } = onlineUsers.find(({ userId }) => userId == data.to);
      socket.to(socketId).emit("message", {
        type: "call-made",
        data: {
          offer: data.offer,
          from: data.from,
        },
      });
    } else if (type == "make-answer") {
      const { socketId } = onlineUsers.find(({ userId }) => userId == data.to);
      socket.to(socketId).emit("message", {
        type: "answer-made",
        data: {
          answer: data.answer
        },
      });
    } else if (type == "new-ice-candidate") {
      const { socketId } = onlineUsers.find(({ userId }) => userId == data.to);
      socket.to(socketId).emit("message", {
        type: "candidate-done",
        data: {
          candidate: data.candidate,
        },
      });
    }
  });
});
// io.on("connection", (socket) => {
//   console.log(Date.now(), "有客户端接入...");
//   socket.emit("current-user", {
//     socketId: socket.id,
//   });
//   console.log(socket.id, "welcome");
//   const existUser = onlineUsers.find((item) => item == socket.id);
//   if (!existUser) {
//     onlineUsers.push(socket.id);
//     socket.emit("update-user-list", {
//       users: onlineUsers,
//     });
//     socket.broadcast.emit("update-user-list", {
//       users: [socket.id],
//     });
//   }
//   socket.on("disconnect", () => {
//     console.log(socket.id, "88");
//     for (let i = 0; i < onlineUsers.length; i++) {
//       if (socket.id == onlineUsers[i]) {
//         onlineUsers.splice(i, 1);
//       }
//     }
//     socket.broadcast.emit("remove-user", {
//       socketId: socket.id,
//     });
//   });
//   socket.on("call-user", (data) => {
//     console.log("--> 呼叫用户");
//     socket.to(data.to).emit("call-made", {
//       offer: data.offer,
//       socket: socket.id,
//     });
//   });
//   socket.on("make-answer", (data) => {
//     console.log("<-- 用户响应");
//     socket.to(data.to).emit("answer-made", {
//       socket: socket.id,
//       answer: data.answer,
//     });
//   });
//   socket.on("new-ice-candidate", (data) => {
//     if (data.candidate) {
//       console.log(data.candidate)
//       socket.to(data.to).emit("candidate-done", {
//         socket: socket.id,
//         candidate: data.candidate,
//       });
//     }
//   });
// });

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(3001);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = "Port " + 3000;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log(`web-rtc-demo 服务已启动`);
}
