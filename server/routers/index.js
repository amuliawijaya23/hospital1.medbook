const { Router } = require('express');

const api = require('./api');

const router = Router();
module.exports = () => {
  api(router);
  return router;
};
