const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const path = require("path");

const app = new Koa();
const router = new Router();

const server = require("http").createServer(app.callback());
const io = require("socket.io")(server);

const socketCallbacks = [];
let socketId;

const walkMatchSocket = (id) => {
  return new Promise((resolve, reject) => {
    let notFound = true;
    while (notFound) {
      for (let i = 0; i < socketCallbacks.length; i++) {
        if (id == socketCallbacks[i].id) {
          socketCallbacks[i].callback(resolve);
          socketCallbacks.splice(i, 1);
          notFound = false
          break;
        }
      }
    }
  });
};
const getSocket = (namespace = "/") => {
  return io.of(namespace).sockets.get(socketId);
};

const createSocketConnect = () => {
  return new Promise((resolve, reject) => {
    io.on("connection", (socket) => {
      socketId = socket.id;
      console.log("socket 链接已创建...");
      resolve(socket);
      // 告知浏览器
      socket.emit("server-notify", {
        event: "connection",
        msg: "socket 服务已创建",
      });
      socket.on("disconnect", () => {
        socket.emit("server-notify", {
          event: "disconnect",
          msg: "socket 连接已关闭",
        });
      });
      // 接受浏览器信息
      socket.on("hybird-notify", ({ event, data }) => {
        console.log("发送给浏览器数据", data);
        socketCallbacks.push({
          id: data.id,
          callback: (_resolve) => _resolve(data),
        });
        console.log(socketCallbacks);
      });
    });
  });
};

app.use(require("koa-static")(path.join(__dirname, "public")));
app.use(bodyParser());

// 业务端代理请求的数据
router.post("/hybirdCall", async (ctx, next) => {
  const socket = getSocket();
  if (!socket) {
    ctx.body = { code: -1, msg: "socket 未连接，请稍后再试" };
  } else {
    socket.emit("server-notify", {
      event: "hybird-call",
      data: ctx.request.body,
    });
    ctx.body = await walkMatchSocket(ctx.request.body.id);
  }
});

app.use(router.routes()).use(router.allowedMethods());

server.listen(3000, async () => {
  await createSocketConnect();

  console.log("服务已启动，端口3000");
});
