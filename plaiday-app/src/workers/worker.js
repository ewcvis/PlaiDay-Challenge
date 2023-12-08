const { getRandomUsers } = require('../services/randomUserService');

const scanWorker = () => {
  const sleepTime = Math.floor(Math.random() * 10) + 1;
  const vulnerabilitiesCount = Math.floor(Math.random() * 5);

  const usersList = getRandomUsers(vulnerabilitiesCount);

  Promise((resolve) => {
    resolve();
  }, sleepTime * 1000);

  return usersList;
};

module.exports = {
  scanWorker,
};
