import { expect } from 'chai';

import { parseHackerNewsHtml } from '../../server/scraper';
import { parseImdbHomeHtml, parseImdbTitleHtml } from '../../server/scraper2';

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
    expect(data).to.have.lengthOf(3);
    expect(data[0]).to.include({ title: 'Story A', comments: 42 });
    expect(data[1]).to.include({ title: 'Story C', comments: 1 });
    expect(data[2]).to.include({ title: 'Story B', comments: 0 });
    expect(data[0].comments_link).to.equal('https://news.ycombinator.com/item?id=1');
  });

  it('parses IMDb homepage titles and links', () => {
    const html = `
      <html><body>
        <div class="title"><a href="/title/tt001/">Movie One</a></div>
        <div class="title"><a href="/title/tt002/">Movie Two</a></div>
      </body></html>
    `;

    const titles = parseImdbHomeHtml(html, { limit: 2 });
    expect(titles).to.deep.equal([
      { title: 'Movie One', link: 'https://www.imdb.com/title/tt001/' },
      { title: 'Movie Two', link: 'https://www.imdb.com/title/tt002/' },
    ]);
  });

  it('parses IMDb title pages for director credit', () => {
    const html = `
      <html><body>
        <div class="credit_summary_item"><a class="itemprop">Jane Doe</a></div>
      </body></html>
    `;

    const director = parseImdbTitleHtml(html);
    expect(director).to.equal('Jane Doe');
  });
});
