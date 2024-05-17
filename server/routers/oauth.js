const passport = require('passport');
const http = require('http');
const querystring = require('querystring');
const axios = require('axios');

const { isAuthenticated } = require('../middleware');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SERVER_API = process.env.SERVER_API;

module.exports = (router) => {
  router.get(
    '/oauth/authorize',
    passport.authenticate('medbook', { scope: 'read:userdata' }),
    (_req, _res) => {
      console.log('Authorizing request...');
    },
  );

  router.get(
    '/oauth/authorize/medication',
    passport.authenticate('medbook', { scope: 'read:medication' }),
    (_req, _res) => {
      console.log('Authorizing request...');
    },
  );

  const getParamsAndAuthenticate = (req, res, next) => {
    const { name } = req.params;
    passport.authenticate('medbook', { scope: `write:${name}` })(
      req,
      res,
      next,
    );
  };
  router.post(
    '/oauth/authorize/medication/:name',
    getParamsAndAuthenticate,
    (_req, _res) => {
      console.log('Authorizing request...');
    },
  );
  router.get(
    '/oauth/auothorize/callback',
    passport.authenticate('medbook', { failureRedirect: '/api/login' }),
    (req, res) => {
      try {
        if (!req.user) {
          res.sendStatus(401);
        }

        if (req.user.scope === 'read:userdata') {
          axios
            .get(`${SERVER_API}/api/user/data`, {
              headers: {
                Authorization: `Bearer ${req.user.accessToken}`,
              },
            })
            .then((response) => {
              const { data } = response;
              res.render('index', { user: req.user });
            })
            .catch((e) => {
              console.log(e);
              res.sendStatus(400);
            });
        } else if (req.user.scope === 'read:medication') {
          axios
            .get(`${SERVER_API}'/api/user/medication`, {
              headers: {
                Authorization: `Bearer ${req.user.accessToken}`,
              },
            })
            .then((response) => {
              const { data } = response;
              res.render('medication', {
                user: req.user,
                medications: data.medical_records.medication,
              });
            })
            .catch((e) => {
              console.log(e);
              res.sendStatus(400);
            });
        } else if (req.user.scope.split(':')[0] === 'write') {
          res.render('form', {
            user: req.user,
            name: req.user.scope.split(':')[1],
          });
        }
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    },
  );

  router.post('/oauth/user/medication/:name', isAuthenticated, (req, res) => {
    try {
      if (!req.body.name || (!req.body.dose && !req.body.frequency)) {
        return res.sendStatus(400);
      }
      axios
        .post(
          `${SERVER_API}/api/user/medication`,
          { ...req.body },
          {
            headers: {
              Authorization: `Bearer ${req.user.accessToken}`,
              'Content-Type': 'application/json',
              accept: 'application/json',
            },
          },
        )
        .then((response) => {
          const { data } = response;
          res.render('medication', {
            user: req.user,
            medications: data.medical_records.medication,
          });
        })
        .catch((e) => {
          console.log(e);
          return res.sendStatus(400);
        });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  router.get('/oauth/refresh', isAuthenticated, (req, res) => {
    try {
      const postData = querystring.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: req.user.refreshToken,
      });

      const options = {
        host: 'localhost',
        path: '/api/oauth/token',
        port: '8080',
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': postData.length,
        },
      };

      const postRequest = http.request(options, (response) => {
        let str = '';
        response.setEncoding('utf-8');
        response.on('data', (chunk) => {
          str += chunk;
        });
        response.on('end', () => {
          const data = JSON.parse(str);
          req.user.accessToken = data.access_token;
          req.user.refreshToken = data.refresh_token;

          res.send(str);
        });
      });

      postRequest.write(postData);
      postRequest.end();
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });
};
