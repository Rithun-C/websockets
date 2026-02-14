import 'dotenv/config';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from '../db/index.js';

await migrate(db, { migrationsFolder: './src/drizzle' });
