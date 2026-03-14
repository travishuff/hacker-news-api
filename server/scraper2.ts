import type { NextFunction, Request, Response } from 'express';
import * as cheerio from 'cheerio';
import { fetchHtml } from './http';

const IMDB_URL = 'https://www.imdb.com/';
const IMDB_BASE = 'https://www.imdb.com';

const normalizeImdbUrl = (url: string | undefined): string => {
  if (!url) {
    return '';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${IMDB_BASE}${url}`;
  }
  return `${IMDB_BASE}/${url}`;
};

type ImdbTitle = {
  title: string;
  link: string;
};

type ParseOptions = {
  limit?: number;
};

export const parseImdbHomeHtml = (
  html: string,
  { limit = 10 }: ParseOptions = {},
): ImdbTitle[] => {
  const $ = cheerio.load(html);
  const candidates: ImdbTitle[] = [];

  $('.title a, a.title, .ipc-title-link-wrapper').each(function collectImdbTitle() {
    const title = $(this).text().trim();
    const link = $(this).attr('href');
    if (title && link) {
      candidates.push({ title, link: normalizeImdbUrl(link) });
    }
  });

  return candidates.slice(0, limit);
};

export const parseImdbTitleHtml = (html: string): string => {
  const $ = cheerio.load(html);
  const credit = $('.credit_summary_item')
    .first()
    .find('.itemprop')
    .text()
    .trim();
  if (credit) {
    return credit;
  }

  const dataTestId = $('[data-testid="title-pc-principal-credit"]').text().trim();
  if (dataTestId) {
    return dataTestId;
  }

  return 'Unknown';
};

// get movies w/ director opening this week
const getData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('accepted request from scraper2.', 'status:', res.statusCode);
    const fetcher = (req.app?.locals?.fetchHtml as typeof fetchHtml | undefined) || fetchHtml;
    const rawLimit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limitParam = typeof rawLimit === 'string' ? rawLimit : undefined;
    const limit = Number.parseInt(limitParam ?? '', 10);
    const maxItems = Number.isFinite(limit) && limit > 0 ? limit : 10;

    const homepageHtml = await fetcher(IMDB_URL);
    const titles = parseImdbHomeHtml(homepageHtml, { limit: maxItems });

    const data = await Promise.all(
      titles.map(async (item) => {
        const detailHtml = await fetcher(item.link);
        const director = parseImdbTitleHtml(detailHtml);
        return { title: item.title, director };
      }),
    );

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export default {
  getData,
};
