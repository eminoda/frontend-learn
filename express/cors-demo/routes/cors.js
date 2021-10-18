const Router = require('express').Router();

Router.options('/', (req, res, next) => {
  res.headers['Access-Control-Allow-Origin'] = '*';
  return res.status(200).send('ok');
});
Router.post('/', (req, res, next) => {
  return res.json({ msg: 'ok' });
});

module.exports = Router;
