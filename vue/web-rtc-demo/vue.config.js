module.exports = {
  devServer: {
    https: true,
    proxy: {
      "/ws": {
        target: "https://localhost:3001", // 后端目标接口地址
        changeOrigin: true, // 是否允许跨域
        ws: false, // 开启ws
        pathRewrite: {
          "^/ws": "", // 重写
        },
      },
    },
  },
};
