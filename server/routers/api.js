const axios = require('axios');
const passport = require('passport');

module.exports = (router) => {
  router.get(
    '/api/hospital1',
    passport.authenticate('hospital1', { scope: 'read:userdata' }),
    (req, res) => {
      console.log('Authorizing request...');
    },
  );
  router.get(
    '/api/hospital1/callback',
    passport.authenticate('hospital1', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/');
    },
  );
};
