const Router = require('express').Router();

Router.post('/', (req, res, next) => {
  return res.json({ msg: 'ok' });
});
Router.get('/', (req, res, next) => {
  return res.json({ msg: 'ok' });
});

module.exports = Router;
