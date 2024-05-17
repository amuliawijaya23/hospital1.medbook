const users = {};

exports.find = function (id, done) {
  try {
    if (!id) {
      return done(null, false);
    }
    return done(null, users[id]);
  } catch (error) {
    done(error);
  }
};

exports.updateOrCreate = function (profile, accessToken, refreshToken, done) {
  try {
    if (!profile || !accessToken || !refreshToken) {
      return done(null, false);
    }

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
    user.scope = profile.scope;

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};
