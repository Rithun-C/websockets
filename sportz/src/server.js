import express from 'express';
import { sql } from './db/index.js';
import { matchRouter } from './routes/matches.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Sportz server is running');
});

app.get('/db-time', async (req, res) => {
  try {
    const result = await sql`SELECT now() AS now`;
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.use('/matches', matchRouter)

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
