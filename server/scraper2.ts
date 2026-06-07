import type { NextFunction, Request, Response } from 'express';

const IMDB_GRAPHQL_URL = 'https://caching.graphql.imdb.com/';
const IMDB_GRAPHQL_TOP_METER_QUERY = `
  query Scraper2TopMeterTitles($limit: Int!) {
    topMeterTitles(first: $limit, filter: { topMeterTitlesType: MOVIE }) {
      edges {
        node {
          titleText {
            text
          }
          principalCredits {
            category {
              text
            }
            credits {
              name {
                nameText {
                  text
                }
              }
            }
          }
        }
      }
    }
  }
`;

type ImdbMovie = {
  title: string;
  director: string;
};

type GraphqlFetcher = (query: string, variables: Record<string, unknown>) => Promise<unknown>;
type JsonRecord = Record<string, unknown>;
type UpstreamError = Error & { status?: number };

const normalizeText = (text: string): string => text.replace(/\s+/g, ' ').trim();

const isRecord = (value: unknown): value is JsonRecord => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

const getGraphqlDirector = (node: JsonRecord): string => {
  const principalCredits = Array.isArray(node.principalCredits) ? node.principalCredits : [];
  const directorCredit = principalCredits.find((credit) => {
    if (!isRecord(credit) || !isRecord(credit.category)) {
      return false;
    }

    return /^Directors?$/i.test(asString(credit.category.text));
  });

  if (!isRecord(directorCredit) || !Array.isArray(directorCredit.credits)) {
    return 'Unknown';
  }

  const directors = directorCredit.credits
    .map((credit) => {
      if (!isRecord(credit) || !isRecord(credit.name) || !isRecord(credit.name.nameText)) {
        return '';
      }

      return normalizeText(asString(credit.name.nameText.text));
    })
    .filter(Boolean);

  return [...new Set(directors)].join(', ') || 'Unknown';
};

export const parseImdbGraphqlTitles = (payload: unknown): ImdbMovie[] => {
  if (!isRecord(payload) || !isRecord(payload.data) || !isRecord(payload.data.topMeterTitles)) {
    return [];
  }

  const edges = payload.data.topMeterTitles.edges;
  if (!Array.isArray(edges)) {
    return [];
  }

  return edges.flatMap((edge) => {
    if (!isRecord(edge) || !isRecord(edge.node) || !isRecord(edge.node.titleText)) {
      return [];
    }

    const title = normalizeText(asString(edge.node.titleText.text));
    if (!title) {
      return [];
    }

    return [{ title, director: getGraphqlDirector(edge.node) }];
  });
};

const fetchImdbGraphql: GraphqlFetcher = async (query, variables) => {
  const response = await fetch(IMDB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const error = new Error(`IMDb GraphQL request failed with status ${response.status}`) as UpstreamError;
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<unknown>;
};

const getLimit = (req: Request): number => {
  const rawLimit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const limitParam = typeof rawLimit === 'string' ? rawLimit : undefined;
  const limit = Number.parseInt(limitParam ?? '', 10);
  return Number.isFinite(limit) && limit > 0 ? limit : 10;
};

// Get popular IMDb movies with director credits.
const getData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('accepted request from scraper2.', 'status:', res.statusCode);
    const graphqlFetcher = (
      req.app?.locals?.fetchImdbGraphql as GraphqlFetcher | undefined
    ) || fetchImdbGraphql;

    const payload = await graphqlFetcher(IMDB_GRAPHQL_TOP_METER_QUERY, { limit: getLimit(req) });
    res.json(parseImdbGraphqlTitles(payload));
  } catch (error) {
    next(error);
  }
};

export default {
  getData,
};
