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
    };

    users[profile.id] = user;
  }

  user.accessToken = accessToken;
  user.refreshToken = refreshToken;

  done(null, user);
};
