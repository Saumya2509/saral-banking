import 'dotenv/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

function chatDevApiPlugin() {
  return {
    name: 'chat-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/chat') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', async () => {
              try {
                const payload = body ? JSON.parse(body) : {};
                const { handleChat } = await import('./server/chatCore.js');
                const { status, body: resBody } = await handleChat(payload);
                res.statusCode = status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(resBody));
              } catch (err) {
                console.error('Vite /api/chat error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'server_error' }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), chatDevApiPlugin()],
  define: {
    __GEMINI_KEY__: JSON.stringify(process.env.GEMINI_API_KEY || ''),
    __GEMINI_MODEL__: JSON.stringify(process.env.GEMINI_MODEL || 'gemini-3.5-flash'),
  },
  server: {
    port: 3000,
    open: true,
  },
});
