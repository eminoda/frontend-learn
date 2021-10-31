new Vue({
  el: "#app",
  //   template: `<van-button>按钮</van-button>`,
  data() {
    return {
      socket: "",
      list: [],
      notify: {
        show: false,
        type: "primary",
        message: "",
      },
    };
  },
  methods: {
    send() {
      this.socket.emit("hybird-notify", {
        event: "nativeCallback",
        data: {
          id: 1,
          data: {
            a: 1,
            b: 2,
          },
        },
      });
    },
  },
  created() {
    this.socket = io();

    this.socket.on("disconnect", () => {
      this.notify.message = "socket 已关闭";
      this.notify.type = "danger";
    });
    this.socket.on("server-notify", ({ event, msg, data }) => {
      if (event == "connection") {
        // const data = this.$notify({ type: 'primary', duration: 0, message: 'socket 连接已创建' })
        this.notify.type = "primary";
        this.notify.message = "socket 连接已创建";
      } else if (event == "hybird-call") {
        this.notify.type = "info";
        this.notify.message = "收到服务端信息";
      }
      this.notify.show = true;
    });
    window.nativeCallback = (data) => {
      console.log("异步调用回调");
      return $jsBridge.publish(data);
    };
  },
});
