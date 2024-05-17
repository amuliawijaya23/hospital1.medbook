const { Router } = require('express');

const oauth = require('./oauth');
const auth = require('./auth');
const site = require('./site');

const router = Router();
module.exports = () => {
  oauth(router);
  auth(router);
  site(router);
  return router;
};
