const expect = require('chai').expect;
const app = require('./../server/server');
const request = require('supertest')(app);
const routes = app._router.stack;

let router_counter = 0;

for (let i = 0; i < routes.length; i++) {
  if (routes[i].route) {
    router_counter++;
  }
}

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
    expect(router_counter).to.be.at.least(2);
  });

  it('should allows cross origin resource sharing (look up Access-Control-Allow-Origin)', (done) => {
    request
      .get('/')
      .expect('Access-Control-Allow-Origin', '*')
      .end(done);
  });
});
