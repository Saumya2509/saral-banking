// server/express.js
import 'dotenv/config';
import express from 'express';
import { handleChat } from './chatCore.js';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '20kb' }));

// Simple per-IP rate limiter: 20 requests / minute
const hits = new Map();
app.use('/api/chat', (req, res, next) => {
  const now = Date.now();
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || 'ip';
  const arr = (hits.get(ip) || []).filter(t => now - t < 60000);
  if (arr.length >= 20) return res.status(429).json({ error: 'too_many_requests' });
  arr.push(now);
  hits.set(ip, arr);
  next();
});

app.post('/api/chat', async (req, res) => {
  const { status, body } = await handleChat(req.body);
  res.status(status).json(body);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'saral-banking-express', time: new Date().toISOString() });
});

// Only bind port when executed directly as standalone process
const isDirectRun = process.argv[1] && (process.argv[1].endsWith('express.js') || process.argv[1].endsWith('express'));
if (isDirectRun || process.env.RUN_STANDALONE === 'true') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
