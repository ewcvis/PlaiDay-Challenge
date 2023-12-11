const axios = require('axios');

const getRandomUsers = (vulnerabilitiesCount) => {
  const apiUrl = 'https://api.example.com';
  const queryParams = {
    size: vulnerabilitiesCount,
  };

  const extractNames = (data) => data;

  axios.get(apiUrl, { params: queryParams })
    .then((response) => {
      const nameList = extractNames(response.data);
      return nameList;
    })
    .catch((error) => {
      console.error('Error making GET request:', error.message);
    });
};

module.exports = {
  getRandomUsers,
};
