// app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('STATUS: OK');
});

app.get('/scan-result', (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is required.' });
  }
  const requestBody = req.body;
  res.send(requestBody);
});

app.post('/start-scan', (req, res) => {
  res.send('start scan');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
