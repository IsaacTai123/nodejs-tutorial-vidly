const request = require('supertest');
const { Genre } = require('../../modules/genres');
let server = require('../../index');
const { User } = require('../../modules/users');

describe('/api/genres', () => {

  beforeEach(() => { server = require('../../index'); });
  afterEach( async () => { 
    server.close(); 
    await Genre.deleteMany({});
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      // populate data in db
      await Genre.collection.insertMany([
        { name: 'Marry' },
        { name: 'Wendy' },
      ]);

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'Wendy')).toBeTruthy();
      expect(res.body.some(g => g.name === 'Marry')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return genre if valid ID is passed', async () => {
      // const genre = await Genre.collection.insertMany([
      //   { name: 'Elena' },
      // ]);
      const genre = new Genre({ name: "horror" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.body.name === 'horror').toBeTruthy();
      expect(res.body).toHaveProperty('name', genre.name);
    });

    it('should return 404 if invalid ID is passed', async () => {
      const res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    // Testing the authorization
    it('should return 401 if client is not logged in', async () => {
      const res = await request(server)
        .post('/api/genres')
        .send({ name: 'comedy' });
      expect(res.status).toBe(401);
    });

    // Testing invalid input
    it('Should return 400 if genre is less than 5 characters', async () => {
      // generate a auth token
      const token = new User().generateAuthToken();

      // include token in the request
      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'kitt' });

      expect(res.status).toBe(400);
    });

    it('Should return 400 if genre is more than 50 characters', async () => {
      // generate a auth token
      const token = new User().generateAuthToken();

      // create a long str more then 50 characters
      const longName = Array(52).join('a');

      // include token in the request
      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: longName });

      expect(res.status).toBe(400);
    });

    // Testing the data is inside the db
    it('should save the genre if it is valid', async () => {
      // generate a auth token
      const token = new User().generateAuthToken();

      // send request with token
      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'kitty' });

      const genre = await Genre.find({ name: 'kitty' });
      
      expect(genre).not.toBeNull();
    });
    
    // Testing the data is in the body of the response
    it('should return the genre if it is valid', async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'kitty' });

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'kitty');
    });
  });
});
