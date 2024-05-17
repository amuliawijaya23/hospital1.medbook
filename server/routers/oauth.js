const passport = require('passport');
const http = require('http');
const querystring = require('querystring');

const { isAuthenticated } = require('../middleware');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

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
  router.get(
    '/oauth/authorize/medication/update',
    passport.authenticate('medbook', { scope: 'write:medication' }),
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
          const options = {
            host: 'localhost',
            path: '/api/user/data',
            port: '8080',
            method: 'GET',
            headers: {
              Authorization: `Bearer ${req.user.accessToken}`,
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
              res.render('account', { user: req.user });
            });
          });
          postRequest.end();
        } else if (req.user.scope === 'read:medication') {
          const options = {
            host: 'localhost',
            path: '/api/user/medication',
            port: '8080',
            method: 'GET',
            headers: {
              Authorization: `Bearer ${req.user.accessToken}`,
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
              res.render('medication', {
                user: req.user,
                medications: data.medical_records.medication,
              });
            });
          });
          postRequest.end();
        }
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    },
  );

  router.get('/oauth/user/medication', isAuthenticated, (req, res) => {
    try {
      const options = {
        host: 'localhost',
        path: '/api/user/medication',
        port: '8080',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
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
          res.send(data);
        });
      });
      postRequest.end();
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  router.get('/oauth/user/data', isAuthenticated, (req, res) => {
    try {
      if (!req.user) {
        res.sendStatus(401);
      }

      const options = {
        host: 'localhost',
        path: '/api/user/data',
        port: '8080',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
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
          res.status(200).json(data).end();
        });
      });

      postRequest.end();
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

  router.post('/oauth/user/medication', isAuthenticated, (req, res) => {
    try {
      const options = {
        host: 'localhost',
        path: '/api/user/medication',
        port: '8080',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
          'content-type': 'application/json',
          accept: 'application/json',
        },
      };

      const postRequest = http.request(options, (response) => {
        response.setEncoding('utf-8');
        response.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        response.on('end', () => {
          console.log('END');
        });
        postRequest.on('error', (e) => {
          console.log(e);
        });
        postRequest.write(JSON.stringify(req.body));
        postRequest.end();
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
