import 'dotenv/config';
import { sql } from '../db/index.js';

await sql`SELECT 1`;
