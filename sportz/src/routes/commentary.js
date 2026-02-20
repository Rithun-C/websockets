import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { commentary } from '../db/schema.js';
import { matchIdParamSchema } from '../validation/matches.js';
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from '../validation/commentary.js';

export const commentaryRouter = Router({ mergeParams: true });
export const MAX_LIMIT = 100;

commentaryRouter.get('/', async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      error: 'Invalid params.',
      details: paramsParsed.error.issues,
    });
  }

  const queryParsed = listCommentaryQuerySchema.safeParse(req.query);
  if (!queryParsed.success) {
    return res.status(400).json({
      error: 'Invalid query.',
      details: queryParsed.error.issues,
    });
  }

  const { id } = paramsParsed.data;
  const limit = Math.min(queryParsed.data.limit ?? 100, MAX_LIMIT);

  try {
    const data = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, id))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});

commentaryRouter.post('/', async (req, res) => {
  const paramsParsed = matchIdParamSchema.safeParse(req.params);
  if (!paramsParsed.success) {
    return res.status(400).json({
      error: 'Invalid params.',
      details: paramsParsed.error.issues,
    });
  }

  const bodyParsed = createCommentarySchema.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({   
      error: 'Invalid payload.',
      details: bodyParsed.error.issues,
    });
  }

  const { id } = paramsParsed.data;
  const { minutes, ...payload } = bodyParsed.data;

  try {
    const [entry] = await db
      .insert(commentary)
      .values({
        matchId: id,
        minute: minutes,
        ...payload,
      })
      .returning();

    if(res.app.locals.broadcastCommentary){
        res.app.locals.broadcastCommentary(entry.matchId, entry);
    }

    return res.status(201).json({ data: entry });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});
