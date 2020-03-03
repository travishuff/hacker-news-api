const expect = require('chai').expect;
const app = require('./../server/server');
const request = require('supertest')(app);
const routes = app._router.stack;

const numRoutes = routes.reduce((all, item) => {
  if (item.route) {
    all++;
  }
  return all;
}, 0);

describe('Unit 9 Node API', () => {
  it('should connect to api', (done) => {
    request
      .get('/')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should provide back json', (done) => {
    request
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should have at least two end points', () => {
    expect(numRoutes).to.be.at.least(2);
  });

  it('should allows cross origin resource sharing (look up Access-Control-Allow-Origin)', (done) => {
    request
      .get('/')
      .expect('Access-Control-Allow-Origin', '*')
      .end(done);
  });
});
