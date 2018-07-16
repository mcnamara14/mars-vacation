process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var knex = require('../db/knex');

var should = chai.should();

chai.use(chaiHttp);

describe('Client Routes', function() {

  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  it('should return a 404 for a route that does not exist', done => {
    chai.request(server)
      .get('/meh')
      .end((err, response) => {
        response.should.have.status(404);
        done();
      });
  });
});

describe('API Routes', function() {
  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() {
          done();
        });
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  });

  describe('GET /api/v1/items', () => {
    it('should return all items', done => {
      chai.request(server)
        .get('/api/v1/items')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Pet rock');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(true);
          done();
        });
    });
  });

  describe('GET /api/v1/items/:id', () => {
    it('should return one item', done => {
      chai.request(server)
        .get('/api/v1/items/2')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Canned tuna');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(false);
          done();
        });
    });
  });

});