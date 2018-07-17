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
  });

  describe('GET /api/v1/items/:id', () => {
    it('should return one item', done => {
      chai.request(server)
        .get('/api/v1/items/2')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1)
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Canned tuna');
          response.body[0].should.have.property('packed');
          response.body[0].packed.should.equal(false);
          done();
        });
    });

    it('should return a 404 when no item is found', done => {
      chai.request(server)
        .get('/api/v1/items/1001')
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Could not find any items with id 1001');
          done();
        });
    });
  });

  describe('POST /api/v1/items', () => {
    it.skip('should post a new item to the database', done => {
      chai.request(server)
        .post('/api/v1/items')
        .send({ name: 'Chicken' })
        .end((error, response) => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
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
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('status');
          response.body.status.should.equal('Item 1 was updated');
          done();
        });
    });

    it('should return a 404 when the parameter passed in does not exist', done => {
      chai.request(server)
        .patch('/api/v1/items/1001')
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Item not found');
          done();
        });
    });
  });

  describe('DELETE /api/v1/items/:id', () => {
    it('should delete an item', done => {
      chai.request(server)
        .get('/api/v1/items/')
        .end((err, response) => {
          response.body.length.should.equal(3);

          chai.request(server)
            .delete('/api/v1/items/1')
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.be.a('object');
              response.body.should.have.property('status');
              response.body.status.should.equal('Item deleted');

              chai.request(server)
                .get('/api/v1/items/')
                .end((err, response) => {
                  response.body.length.should.equal(2);
                  done();
                });
            });
        });
    });

    it('should return a 403 response when the item id passed in does not exist', done => {
      chai.request(server)
        .delete('/api/v1/items/4')
        .end((err, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Error item not found');
          done();
        });
    });
  });
});