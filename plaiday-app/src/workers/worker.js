const amqp = require('amqplib');
const { getRandomUsers } = require('../services/randomUserService');
const db = require('../db/db');

const rabbitMQUrl = 'amqp://localhost';
const queue = 'scanQueue';

async function scan(requestId) {
  function updateStatus(status, id, findings) {
    const query = 'UPDATE events SET status = ?, findings = ?, timeEnd = CURRENT_TIMESTAMP WHERE scanId = ?';
    const values = [status, findings, id];
    db.run(query, values, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
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

    return JSON.stringify({ findings });
  }

  const sleepTime = Math.floor(Math.random() * 10) + 1;
  const vulnerabilitiesCount = Math.floor(Math.random() * 5);
  const usersList = getRandomUsers(vulnerabilitiesCount);
  const findings = formatFindings(usersList);

  Promise((resolve) => {
    resolve();
  }, sleepTime * 1000);

  if (vulnerabilitiesCount === 0) {
    updateStatus('Success', requestId, findings);
  } else {
    updateStatus('Failure', requestId, findings);
  }
}

async function startWorker() {
  const connection = await amqp.connect(rabbitMQUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (request) => {
    if (request) {
      const requestString = request.content.toString();
      const requestObject = JSON.parse(requestString);
      const updateQuery = 'UPDATE events SET status = ?, timeStart = CURRENT_TIMESTAMP WHERE scanId = ?';
      const values = ['In Progress', requestObject.requestId];
      db.run(updateQuery, values, (err) => {
        if (err) {
          console.error(err.message);
        }
      });
      await scan(requestObject.requestId);
      channel.ack(request);
    }
  });
}

startWorker();
