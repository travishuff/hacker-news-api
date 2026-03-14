process.env.DISABLE_CACHE = 'true';

import { EventEmitter } from 'events';
import { expect } from 'chai';
import httpMocks from 'node-mocks-http';

import app from '../../server/server';

const HN_URL = 'https://news.ycombinator.com/';
const IMDB_URL = 'https://www.imdb.com/';

type RequestOptions = {
  method: string;
  url: string;
  headers?: Record<string, string>;
};

describe('API routes (integration)', () => {
  const makeRequest = ({ method, url, headers }: RequestOptions) => {
    const req = httpMocks.createRequest({
      method,
      url,
      headers,
    });

    const res = httpMocks.createResponse({ eventEmitter: EventEmitter });

    return new Promise<typeof res>((resolve) => {
      res.on('end', () => resolve(res));
      app.handle(req, res);
    });
  };
  afterEach(() => {
    delete app.locals.fetchHtml;
  });

  it('GET / returns sorted Hacker News data and CORS headers', async () => {
    const hnHtml = `
      <html><body>
        <table><tbody>
          <tr class="athing"><td class="title"><span class="titleline"><a href="https://example.com/a">Story A</a></span></td></tr>
          <tr><td class="subtext"><a href="user?id=a">a</a><a href="item?id=1">3 comments</a></td></tr>
          <tr class="athing"><td class="title"><span class="titleline"><a href="https://example.com/b">Story B</a></span></td></tr>
          <tr><td class="subtext"><a href="user?id=b">b</a><a href="item?id=2">12 comments</a></td></tr>
        </tbody></table>
      </body></html>
    `;

    app.locals.fetchHtml = async (url) => {
      if (url === HN_URL) {
        return hnHtml;
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    const response = await makeRequest({
      method: 'GET',
      url: '/?limit=2',
      headers: { Accept: 'application/json' },
    });

    expect(response._getStatusCode()).to.equal(200);
    expect(response._getHeaders()['access-control-allow-origin']).to.equal('*');
    const body = JSON.parse(response._getData());
    expect(body).to.have.lengthOf(2);
    expect(body[0]).to.include({ title: 'Story B', comments: 12 });
    expect(body[1]).to.include({ title: 'Story A', comments: 3 });
  });

  it('GET /scraper2 returns IMDb data', async () => {
    const imdbHomeHtml = `
      <html><body>
        <div class="title"><a href="/title/tt001/">Movie One</a></div>
        <div class="title"><a href="/title/tt002/">Movie Two</a></div>
      </body></html>
    `;

    const imdbMovie1Html = `
      <html><body>
        <div class="credit_summary_item"><a class="itemprop">Jane Doe</a></div>
      </body></html>
    `;

    const imdbMovie2Html = `
      <html><body>
        <div class="credit_summary_item"><a class="itemprop">John Smith</a></div>
      </body></html>
    `;

    const fixtures = new Map([
      [IMDB_URL, imdbHomeHtml],
      ['https://www.imdb.com/title/tt001/', imdbMovie1Html],
      ['https://www.imdb.com/title/tt002/', imdbMovie2Html],
    ]);

    app.locals.fetchHtml = async (url) => {
      if (fixtures.has(url)) {
        return fixtures.get(url);
      }
      throw new Error(`Unexpected URL: ${url}`);
    };

    const response = await makeRequest({
      method: 'GET',
      url: '/scraper2?limit=2',
      headers: { Accept: 'application/json' },
    });

    expect(response._getStatusCode()).to.equal(200);
    const body = JSON.parse(response._getData());
    expect(body).to.deep.equal([
      { title: 'Movie One', director: 'Jane Doe' },
      { title: 'Movie Two', director: 'John Smith' },
    ]);
  });

  it('returns 500 when upstream fetch fails', async () => {
    app.locals.fetchHtml = async () => {
      throw new Error('Upstream unavailable');
    };

    const response = await makeRequest({
      method: 'GET',
      url: '/',
      headers: { Accept: 'application/json' },
    });

    expect(response._getStatusCode()).to.equal(500);
    const body = JSON.parse(response._getData());
    expect(body).to.deep.equal({ error: 'Internal Server Error' });
  });
});
