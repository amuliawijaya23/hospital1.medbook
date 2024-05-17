const { isAuthenticated } = require('../middleware');

module.exports = (router) => {
  router.get('/logout', isAuthenticated, async (req, res, next) => {
    await req.logout((error) => {
      if (error) {
        return next(error);
      }
      return res.redirect('/');
    });
  });
};
