import type { NextFunction, Request, Response } from 'express';
import * as cheerio from 'cheerio';
import { fetchHtml } from './http';

const HN_URL = 'https://news.ycombinator.com/';
const HN_BASE = 'https://news.ycombinator.com';

const parseCommentCount = (text: string): number => {
  const match = text.match(/(\d+)\s+comment/i);
  if (!match) {
    return 0;
  }
  return Number(match[1]);
};

const normalizeUrl = (url: string | undefined, base: string): string => {
  if (!url) {
    return '';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${base}${url}`;
  }
  if (url.startsWith('item?')) {
    return `${base}/${url}`;
  }
  return url;
};

type HackerNewsItem = {
  title: string;
  link: string;
  comments: number;
  comments_link: string;
};

type ParseOptions = {
  limit?: number;
};

export const parseHackerNewsHtml = (
  html: string,
  { limit = 30 }: ParseOptions = {},
): HackerNewsItem[] => {
  const $ = cheerio.load(html);
  const titleLinks = $('.titleline a, a.storylink');
  const subtexts = $('.subtext');
  const max = Math.min(limit, titleLinks.length, subtexts.length);

  const data: HackerNewsItem[] = [];
  for (let i = 0; i < max; i += 1) {
    const titleEl = titleLinks.eq(i);
    const subtext = subtexts.eq(i);

    const title = titleEl.text().trim();
    const link = normalizeUrl(titleEl.attr('href'), HN_BASE);

    const commentAnchor = subtext.find('a').last();
    const commentText = commentAnchor.text().trim();
    const comments = parseCommentCount(commentText);
    const commentsLink = normalizeUrl(commentAnchor.attr('href'), HN_BASE);

    data.push({
      title,
      link,
      comments,
      comments_link: commentsLink,
    });
  }

  return data.sort((a, b) => b.comments - a.comments);
};

/* Get top most commented Hacker News articles */
const getData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('accepted request from scraper.', 'status:', res.statusCode);
    const fetcher = (req.app?.locals?.fetchHtml as typeof fetchHtml | undefined) || fetchHtml;
    const rawLimit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limitParam = typeof rawLimit === 'string' ? rawLimit : undefined;
    const limit = Number.parseInt(limitParam ?? '', 10);
    const maxItems = Number.isFinite(limit) && limit > 0 ? limit : 30;
    const html = await fetcher(HN_URL);
    const data = parseHackerNewsHtml(html, { limit: maxItems });
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export default {
  getData,
};
