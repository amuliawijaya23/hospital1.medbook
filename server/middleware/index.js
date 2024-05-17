exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated) {
    return res.redirect('/login');
  }
  return next();
};

exports.isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated) {
    return res.redirect('/');
  }
  return next();
};
