const axios = require('axios');

module.exports = (router) => {
  router.get('/api/user/medication/:id', async (req, res) => {
    const { id } = req.params;

    const response = await axios.get(
      `http://localhost:8080/user/medication/${id}`,
    );

    return res.status(200).json(response.data).end();
  });
  router.patch('/api/user/medication/:id/:medicationId', async (req, res) => {
    const { id, medicationId } = req.params;
    const { dose, frequency } = req.body;

    const response = await axios.patch(
      `http://localhost:8080/user/medication/${id}/${medicationId}`,
      { dose, frequency },
    );

    return res.status(200).json(response.data).end();
  });
  router.post('/api/user/medication/:id', async (req, res) => {
    const { id } = req.params;
    const { name, dose, frequency } = req.body;

    const response = await axios.post(
      `http://localhost:8080/user/medication/${id}`,
      { name, dose, frequency },
    );

    return res.status(200).json(response.data).end();
  });
};
