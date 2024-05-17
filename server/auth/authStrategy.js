const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const InternalOAuthError = require('passport-oauth').InternalOAuthError;
const { access } = require('fs');
const util = require('util');

function Strategy(options, verify) {
  this;
  const opts = options || {};
  opts.authorizationURL =
    options.authorizationURL || 'http://localhost:8080/api/oauth/authorize';
  opts.tokenURL = options.tokenURL || 'http://localhost:8080/api/oauth/token';

  OAuth2Strategy.call(this, opts, verify);
  this.name = 'medbook';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.getProtectedResource(
    'http://localhost:8080/api/user',
    accessToken,
    (error, body, res) => {
      if (error) {
        return done(new InternalOAuthError(error));
      }

      try {
        const json = JSON.parse(body);

        const profile = {
          provider: 'medbook',
          id: json.user_id,
          email: json.email,
          scope: json.scope,
          token: accessToken,
        };

        return done(null, profile);
      } catch (e) {
        return done(e);
      }
    },
  );
};

exports.Strategy = Strategy;
