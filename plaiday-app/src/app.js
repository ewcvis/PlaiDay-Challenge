const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const uuid = require('uuid');
const db = require('./db/db');

const app = express();
const port = 8080;
app.use(bodyParser.json());

const rabbitMQUrl = 'amqp://localhost';
const queue = 'scanQueue';

app.get('/', (req, res) => {
  res.send('STATUS: OK');
});

app.get('/scan-result', (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is required.' });
  }
  if (!req.body.repo) {
    return res.status(400).json({ error: 'The "id" key is required in your request body' });
  }
  const requestBody = req.body;
  const query = `SELECT * FROM events WHERE scanId = ${requestBody.id}`;

  db.all(query, (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
  });

  return res.send(rows);
});

app.post('/start-scan', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is required.' });
  }
  if (!req.body.repo) {
    return res.status(400).json({ error: 'The "repo" key is required in your request body' });
  }

  const requestId = uuid.v4();
  const connection = await amqp.connect(rabbitMQUrl);
  const channel = await connection.createChannel();
  await channel.assertQueue(queue, { durable: true });
  const requestBody = req.body;
  requestBody.requestId = requestId;
  const requestString = JSON.stringify(requestBody);
  channel.sendToQueue(queue, Buffer.from(requestString));

  const query = 'INSERT INTO events (scanId, repoName, status) VALUES (?, ?, ?)';
  const values = [requestId, requestBody.repo, 'Queued'];

  db.run(query, values, (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    return res.send(`Scan Queued with ID: ${requestId.toString()}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
