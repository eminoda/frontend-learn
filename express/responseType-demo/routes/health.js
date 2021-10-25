const Router = require("express").Router();

Router.get("/", (req, res, next) => {
  return res.json({ code: 1, msg: "ok" });
});

module.exports = Router;
