const users = {};

exports.find = function (id, done) {
  return done(null, users[id]);
};

exports.updateOrCreate = function (profile, accessToken, refreshToken, done) {
  let user = users[profile.id];
  if (!user) {
    user = {
      id: profile.id,
      email: profile.email,
      scope: profile.scope,
    };

    users[profile.id] = user;
  }

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  user.scope = profile.scope;

  done(null, user);
};
