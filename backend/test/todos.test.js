const request = require('supertest');
const { expect } = require('chai');
const { app, startServer, connectToDatabase } = require('../server'); // Assurez-vous que le serveur est exporté dans server.js
const Todo = require('../models/Todo');
const Tag = require('../models/Tag');
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/todo-test';
let server;

describe('Todos API', () => {

  before(async () => {
    await connectToDatabase(MONGO_URI);
    server = await startServer();
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    server.close();
  });

  let todoId;
  let tagId;

  it('should create a new tag', async () => {
    console.time('Create Tag');
    const res = await request(server)
      .post('/api/tags')
      .send({ name: 'Important', color: '#ff0000' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('name', 'Important');
    expect(res.body).to.have.property('color', '#ff0000');
    tagId = res.body._id;
  });

  it('should create a new todo', async () => {
    const res = await request(server)
      .post('/api/todos')
      .send({ title: 'Buy groceries', tags: [tagId] });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('title', 'Buy groceries');
    expect(res.body.tags).to.include(tagId);
    todoId = res.body._id;
  });

  it('should add tags to a todo', async () => {
    const res = await request(server)
      .post(`/api/todos/${todoId}/tags`)
      .send({ tags: [tagId] });
    expect(res.status).to.equal(200);
    expect(res.body.tags).to.include(tagId);
  });

  it('should remove tags from a todo', async () => {
    const res = await request(server)
      .delete(`/api/todos/${todoId}/tags`)
      .send({ tags: [tagId] });
    expect(res.status).to.equal(200);
    expect(res.body.tags).to.not.include(tagId);
  });

  it('should search todos by title', async () => {
    const res = await request(app).get('/api/todos/search?title=groceries');
    expect(res.status).to.equal(200);
    expect(res.body.todos).to.be.an('array');
    expect(res.body.todos.length).to.be.greaterThan(0);
  });

  it('should filter todos by completed status', async () => {
    const res = await request(app).get('/api/todos/search?completed=false');
    expect(res.status).to.equal(200);
    expect(res.body.todos).to.be.an('array');
    expect(res.body.todos.length).to.be.greaterThan(0);
  });

  it('should filter todos by tag', async () => {
    const res = await request(app).get(`/api/todos/search?tag=${tagId}`);
    expect(res.status).to.equal(200);
    expect(res.body.todos).to.be.an('array');
    expect(res.body.todos.length).to.be.greaterThan(0);
  });

  it('should delete a todo', async () => {
    const res = await request(server).delete(`/api/todos/${todoId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Deleted Todo');
  });

  it('should return 404 for a non-existing todo', async () => {
    const res = await request(server).get(`/api/todos/${todoId}`);
    expect(res.status).to.equal(404);
  });
});