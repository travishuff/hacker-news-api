import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import apicache from 'apicache';
import scraperController from './scraper';
import scraperController2 from './scraper2';

type CacheMiddleware = typeof apicache.middleware;

const app = express();
const cache: CacheMiddleware = process.env.DISABLE_CACHE === 'true'
  ? (() => (req: Request, res: Response, next: NextFunction) => next()) as CacheMiddleware
  : apicache.middleware;

app.disable('x-powered-by');

// middleware for CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  next();
});

// middleware for caching in each individual route
app.get('/', cache('5 minutes'), scraperController.getData);

app.get('/scraper2', cache('5 minutes'), scraperController2.getData);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ error: 'Internal Server Error' });
});

if (require.main === module) {
  app.listen(process.env.PORT || 3000);
}

export default app;
