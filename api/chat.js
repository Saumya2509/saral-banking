// api/chat.js
import { handleChat } from '../server/chatCore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const { status, body } = await handleChat(req.body);
  res.status(status).json(body);
}
