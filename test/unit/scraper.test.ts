import { describe, expect, it } from 'bun:test';

import { parseHackerNewsHtml } from '../../server/scraper';
import { parseImdbGraphqlTitles } from '../../server/scraper2';

describe('Scraper parsers (unit)', () => {
  it('parses and sorts Hacker News items by comment count', () => {
    const html = `
      <html><body>
        <table><tbody>
          <tr class="athing"><td class="title"><span class="titleline"><a href="https://example.com/a">Story A</a></span></td></tr>
          <tr><td class="subtext"><a href="user?id=a">a</a><a href="item?id=1">42 comments</a></td></tr>
          <tr class="athing"><td class="title"><span class="titleline"><a href="https://example.com/b">Story B</a></span></td></tr>
          <tr><td class="subtext"><a href="user?id=b">b</a><a href="item?id=2">discuss</a></td></tr>
          <tr class="athing"><td class="title"><span class="titleline"><a href="https://example.com/c">Story C</a></span></td></tr>
          <tr><td class="subtext"><a href="user?id=c">c</a><a href="item?id=3">1 comment</a></td></tr>
        </tbody></table>
      </body></html>
    `;

    const data = parseHackerNewsHtml(html, { limit: 3 });
    expect(data).toHaveLength(3);
    expect(data[0]).toMatchObject({ title: 'Story A', comments: 42 });
    expect(data[1]).toMatchObject({ title: 'Story C', comments: 1 });
    expect(data[2]).toMatchObject({ title: 'Story B', comments: 0 });
    expect(data[0].comments_link).toBe('https://news.ycombinator.com/item?id=1');
  });

  it('parses IMDb GraphQL MOVIEmeter titles and directors', () => {
    const payload = {
      data: {
        topMeterTitles: {
          edges: [
            {
              node: {
                titleText: { text: 'Movie One' },
                principalCredits: [
                  {
                    category: { text: 'Director' },
                    credits: [
                      { name: { nameText: { text: 'Jane Doe' } } },
                      { name: { nameText: { text: 'John Smith' } } },
                      { name: { nameText: { text: 'Jane Doe' } } },
                    ],
                  },
                  {
                    category: { text: 'Writer' },
                    credits: [
                      { name: { nameText: { text: 'Not The Director' } } },
                    ],
                  },
                ],
              },
            },
            {
              node: {
                titleText: { text: 'Movie Two' },
                principalCredits: [],
              },
            },
          ],
        },
      },
    };

    const titles = parseImdbGraphqlTitles(payload);
    expect(titles).toEqual([
      { title: 'Movie One', director: 'Jane Doe, John Smith' },
      { title: 'Movie Two', director: 'Unknown' },
    ]);
  });
});
