const passport = require('passport');
const AppStrategy = require('./authStrategy').Strategy;
const users = require('../users');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

const initializePassport = () => {
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    users.find(id, (error, user) => {
      if (error) {
        return done(error);
      }
      return done(null, user);
    });
  });

  passport.use(
    new AppStrategy(
      {
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      (accessToken, refreshToken, profile, done) => {
        process.nextTick(() => {
          users.updateOrCreate(
            profile,
            accessToken,
            refreshToken,
            (error, user) => {
              if (error) {
                return done(error);
              }
              return done(null, user);
            },
          );
        });
      },
    ),
  );
};

module.exports = initializePassport;
