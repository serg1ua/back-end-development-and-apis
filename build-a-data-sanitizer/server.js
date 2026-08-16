import path from 'node:path';
import express from 'express';
import bodyParser from 'body-parser';
import { inputCleaner, inputValidator } from './middleware.js';

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded());

app.get('/', (req, res) => {
  res.redirect('/form');
});

app.get('/form', (req, res) => {
  res.status(200).sendFile(path.join(import.meta.dirname, 'public', 'index.html'));
});

app.post('/submit', [inputCleaner, inputValidator], (req, res) => {
  res.status(200).send(req.body);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});