const axios = require('axios');

module.exports = (router) => {
  router.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const response = await axios.post('http://localhost:8080/login', {
        email,
        password,
      });

      return res.status(200).json(response.data).end();
    } catch (error) {
      return res.sendStatus(400);
    }
  });
};
