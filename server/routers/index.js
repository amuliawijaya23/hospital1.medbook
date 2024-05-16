const { Router } = require('express');

const api = require('./api');
const auth = require('./auth');

const router = Router();
module.exports = () => {
  api(router);
  auth(router);
  return router;
};
