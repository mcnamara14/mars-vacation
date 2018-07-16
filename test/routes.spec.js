process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');
var knex = require('../db/knex');

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

    it('should return a 404 when no item is found', done => {
      chai.request(server)
        .get('/api/v1/items/1001')
        .end((err, response) => {
          response.should.have.status(404);
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

  describe('POST /api/v1/items/', () => {
    it('should add an item', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'Monkey'
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
          done();
        });
    });

    it('should return a 422 when all parameters are not passed in the body', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({})
        .end((err, response) => {
          response.should.have.status(422);
          done();
        });
    });
  });

  describe('PATCH /api/v1/items/:id', () => {
    it('should update an item', done => {
      chai.request(server)
        .patch('/api/v1/items/1')
        .send({
          name: 'Monkey'
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          done();
        });
    });

    it('should return a 500 response when the item id passed in does not exist', done => {
      chai.request(server)
        .patch('/api/v1/items/1001')
        .end((err, response) => {
          response.should.have.status(500);
          done();
        });
    });
  });

  describe('DELETE /api/v1/items/:id', () => {
    it('should delete an item', done => {
      chai.request(server)
        .delete('/api/v1/items/1')
        .end((err, response) => {
          response.should.have.status(202);
          response.body.should.be.a('object');
          done();
        });
    });

    it('should return a 403 response when the item id passed in does not exist', done => {
      chai.request(server)
        .delete('/api/v1/items/1001')
        .end((err, response) => {
          response.should.have.status(403);
          done();
        });
    });
  });
});