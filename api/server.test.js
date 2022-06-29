const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('users').truncate();
});
afterAll(async () => {
  await db.destroy();
})


test('sanity', () => {
  expect(process.env.NODE_ENV).toBe('testing');
});

const login = {username: 'sachi komine', password: 'best girl'};

describe('Tests for api/auth/register',  () => {
  const URL = '/api/auth/register';
  test('correctly registers a new user', async () => {
    let res = await request(server).post(URL).send(login);
    expect(res.body.id).toBe(1);
    expect(res.body.username).toBe('sachi komine');
  });
  test('sends correct error message on missing parts', async () => {
    let res = await request(server).post(URL).send({username: "tada banri"});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('username and password required');

    res = await request(server).post(URL).send({password: "worst character in golden time"});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('username and password required');
  })
})

describe('Tests for api/auth/login', () => {
  const URL = '/api/auth/login';

  test('responds correctly upon login', async () => {
    await request(server).post('/api/auth/register').send(login);
    let res = await request(server).post(URL).send(login);
    expect(res.body).toBeDefined();
    expect(res.body.message).toBe('Welcome back, sachi komine');
    expect(res.body.token).toBeDefined();
  });

  test('responds correctly upon false credentials', async () => {
    let res = await request(server).post(URL).send({username: 'jar jar binks', password: "meesa stupid"});

    expect(res.body).toBeDefined();
    expect(res.body.message).toBe('invalid credentials');

    res = await request(server).post(URL).send({password: 'drive is a good movie'});
    expect(res.body).toBeDefined();
    expect(res.body.message).toBe('username and password required');
  })
})

