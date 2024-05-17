const http = require('http');
const querystring = require('querystring');
const { isAuthenticated } = require('../middleware');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

module.exports = (router) => {
  router.get('/', (req, res) => {
    res.render('index', { user: req.user });
  });
  router.get('/account', isAuthenticated, (req, res) => {
    res.render('account', { user: req.user });
  });
  router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
  });
  router.get('/logout', async (req, res, next) => {
    await req.logout((error) => {
      if (error) {
        return next(error);
      }
      return res.redirect('/');
    });
  });
  router.get('/user', isAuthenticated, (req, res) => {
    res.json(req.user);
  });
  router.get('/user/info', isAuthenticated, (req, res) => {
    const options = {
      host: 'localhost',
      path: '/user/data',
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
  });
  router.get('/refresh_token', isAuthenticated, (req, res) => {
    const postData = querystring.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: req.user.refreshToken,
    });

    const options = {
      host: 'localhost',
      path: '/oauth/token',
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
  });
};
