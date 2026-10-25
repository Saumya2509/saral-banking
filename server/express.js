// server/express.js
import 'dotenv/config';
import express from 'express';
import { handleChat } from './chatCore.js';

const app = express();
app.use(express.json({ limit: '20kb' }));

// simple per-IP limit: 20 requests / minute
const hits = new Map();
app.use('/api/chat', (req, res, next) => {
  const now = Date.now(), ip = req.ip;
  const arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  if (arr.length >= 20) return res.status(429).json({ error: 'too_many_requests' });
  arr.push(now); hits.set(ip, arr); next();
});

app.post('/api/chat', async (req, res) => {
  const { status, body } = await handleChat(req.body);
  res.status(status).json(body);
});

app.use(express.static('dist'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
