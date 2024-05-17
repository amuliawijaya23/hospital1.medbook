const { isAuthenticated, isNotAuthenticated } = require('../middleware');

module.exports = (router) => {
  router.get('/', (req, res) => {
    res.render('index', { user: req.user });
  });
  router.get('/account', isAuthenticated, (req, res) => {
    res.render('account', { user: req.user });
  });
  router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login', { user: req.user });
  });
};
