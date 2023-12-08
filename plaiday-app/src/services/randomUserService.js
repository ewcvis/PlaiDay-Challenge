const axios = require('axios');

const getRandomUsers = (vulnerabilitiesCount) => {
  const apiUrl = 'https://api.example.com';
  const queryParams = {
    size: vulnerabilitiesCount,
  };

  axios.get(apiUrl, { params: queryParams })
    .then((response) => {
      console.log('Response from API:', response.data);
      return response.data;
    })
    .catch((error) => {
      console.error('Error making GET request:', error.message);
    });
};

module.exports = {
  getRandomUsers,
};
