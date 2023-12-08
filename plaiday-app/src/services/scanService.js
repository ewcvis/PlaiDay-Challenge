const { scanWorker } = require('../workers/worker.js');

const scanStart = (repo) => {
  // create database entry with status
  const usersList = scanWorker();
  // format data here

  // send to database
};

const scanResults = () => {

};

module.exports = {
  scanStart,
  scanResults,
};
