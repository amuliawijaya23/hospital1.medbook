const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const InternalOAuthError = require('passport-oauth').InternalOAuthError;
const util = require('util');

function Strategy(options, verify) {
  this;
  const opts = options || {};
  opts.authorizationURL =
    options.authorizationURL || 'http://localhost:8080/dialog/authorize';
  opts.tokenURL = options.tokenURL || 'http://localhost:8080/oauth/token';

  OAuth2Strategy.call(this, opts, verify);
  this.name = 'hospital1';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.getProtectedResource(
    'http://localhost:8080/user/info',
    accessToken,
    (error, body, res) => {
      if (error) {
        return done(new InternalOAuthError(error));
      }

      try {
        const json = JSON.parse(body);

        const profile = {
          provider: 'hospital1',
          id: json.user_id,
          email: json.email,
        };

        return done(null, profile);
      } catch (e) {
        return done(e);
      }
    },
  );
};

exports.Strategy = Strategy;
