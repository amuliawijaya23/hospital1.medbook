const { isAuthenticated } = require('../middleware');

module.exports = (router) => {
  router.get('/logout', async (req, res, next) => {
    await req.logout((error) => {
      if (error) {
        return next(error);
      }
      return res.redirect('/');
    });
  });
  router.get('/user', isAuthenticated, (req, res) => {
    res.json(req.user);
  });
};
