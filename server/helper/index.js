const http = require('http');

exports.getProtectedResource = (path, accessToken, done) => {
  const options = {
    host: 'localhost',
    path: path,
    porth: '8080',
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  http
    .get(options, (response) => {
      let str = '';

      response.on('data', (chunk) => {
        str += chunk;
      });

      response.on('end', () => done(null, str));
    })
    .on('error', (error) => done(error));
};
