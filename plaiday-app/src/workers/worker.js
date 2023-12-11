const amqp = require('amqplib');
const events = require('events');
const { getRandomUsers } = require('../services/randomUserService');
const db = require('../db/db');

const rabbitMQUrl = 'amqp://localhost';
const queue = 'scanQueue';
const requestStatus = {};
const eventEmitter = new events.EventEmitter();

async function scan(request) {
  const requestString = request.content.toString();
  const requestObject = JSON.parse(requestString);

  // set status to 'In Progress'

  const sleepTime = Math.floor(Math.random() * 10) + 1;
  const vulnerabilitiesCount = Math.floor(Math.random() * 5);
  const usersList = getRandomUsers(vulnerabilitiesCount);
  const findings = formatFindings(usersList);

  Promise((resolve) => {
    resolve();
  }, sleepTime * 1000);

  if (vulnerabilitiesCount == 0) {
    // set status to 'Success'
  } else {
    // set status to 'Failure'
  }

  function formatFindings(usersList) {
    const template = {
      type: 'sast',
      location: {
        path: '',
        positions: {
          begin: {
            line: 0,
          },
        },
      },
    };

    const findings = [];

    usersList.forEach((user) => {
      const finding = { ...template };
      finding.location.path = `${user.first_name} ${user.last_name}`;
      finding.location.positions.begin.line = Math.floor(Math.random() * 100) + 1;
      findings.push(finding);
    });

    return findings;
  }
}

async function startWorker() {
  const connection = await amqp.connect(rabbitMQUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (request) => {
    if (request) {
      await scan(request);
      channel.ack(request);
    }
  });
}

startWorker();
