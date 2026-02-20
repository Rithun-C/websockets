import express from 'express';
import http from 'http';
import { sql } from './db/index.js';
import { matchRouter } from './routes/matches.js';
import { attachWsServer } from './ws/server.js';
import { securityMiddleware } from './arcjet.js';
import { commentaryRouter } from './routes/commentary.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Sportz server is running');
});

app.use(securityMiddleware());
app.use('/matches', matchRouter)
app.use('/matches/:id/commentary', commentaryRouter);
const {broadcastMatchCreated, broadcastCommentary} = attachWsServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` :  `http://${HOST}:${PORT}`
  console.log(`Server started on ${baseUrl}`);
  console.log(`WebSocketServer started on ${baseUrl.replace('http', 'ws')}/ws`);
});
