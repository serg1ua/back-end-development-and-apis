import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { WebSocketServer } from 'ws';

const PORT = 3001;

const server = http.createServer();
const wss = new WebSocketServer({ server });

server.on('request', (req, res) => {
  if (req.url === '/') {
    const file = fs.readFileSync(path.join(import.meta.dirname, 'public', 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(file);
  } else if (req.url === '/script.js') {
    const file = fs.readFileSync(path.join(import.meta.dirname, 'public', 'script.js'));
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    res.end(file);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
});

wss.on('connection', (socket, req) => {
  const username = new URL(req.url, "http://localhost").searchParams.get(
    "username",
  );

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ 'type': 'system', 'text': `${username} joined` }));
    }
  });

  socket.on('message', (data) => {
    const d = JSON.parse(data.toString('utf-8'));
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'chat', username: d.username, text: d.text }));
      }
    });
  });

  socket.on('close', () => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ 'type': 'system', 'text': `${username} left` }));
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});