const request = require('supertest');
const { expect } = require('chai');
const { app, startServer, connectToDatabase } = require('../server'); // Ensure server.js exports startServer
const Tag = require('../models/Tag');
const mongoose = require('mongoose');

describe('Tags API', () => {
  let server; // Variable to store the server instance
  let tagId; // Variable to store the ID of the created tag
  const TEST_DB_URI = 'mongodb://localhost:27017/todo-test';

  // Before all tests, start the server and connect to the test database
  before(async () => {
    await await connectToDatabase(TEST_DB_URI);
    server = await startServer(); // Start the server and save the instance
    await Tag.deleteMany(); // Clear all existing tags in the test database
  });

  // After all tests, close the server and clean up the database
  after(async () => {
    await mongoose.connection.dropDatabase(); // Drop the test database
    await mongoose.connection.close(); // Close the database connection
    server.close(); // Close the server instance
  });

  it('should create a new tag', async () => {
    const res = await request(server)
      .post('/api/tags')
      .send({ name: 'Important', color: '#ff0000' });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('name', 'Important');
    expect(res.body).to.have.property('color', '#ff0000');
    tagId = res.body._id; // Save the tag ID for other tests
  });

  it('should get all tags', async () => {
    const res = await request(server).get('/api/tags');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
  });

  it('should update a tag', async () => {
    const res = await request(server)
      .patch(`/api/tags/${tagId}`)
      .send({ name: 'Very Important', color: '#ff00ff' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('name', 'Very Important');
    expect(res.body).to.have.property('color', '#ff00ff');
  });

  it('should delete a tag', async () => {
    const res = await request(server).delete(`/api/tags/${tagId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message', 'Deleted Tag');
  });

  it('should return 404 for a non-existing tag', async () => {
    const res = await request(server).get(`/api/tags/${tagId}`);
    expect(res.status).to.equal(404);
  });
});
