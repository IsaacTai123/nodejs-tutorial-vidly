const request = require('supertest');
const { Genre } = require('../../modules/genres');
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

    // Defind the happy path, and then in each test, we change 
    // one parameter that clearly aligns with the name of the test.

    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: name }); // if key and value are the same we can shrink it down to just "{ name }"
    };

    beforeEach(() => {
      // generate a auth token before each test
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    // Testing the authorization
    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    // Testing invalid input
    it('Should return 400 if genre is less than 5 characters', async () => {
      name = '1234';
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('Should return 400 if genre is more than 50 characters', async () => {

      // create a long str more then 50 characters
      name = Array(52).join('a');
      const res = await exec();

      expect(res.status).toBe(400);
    });

    // Testing the data is inside the db
    it('should save the genre if it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genre1' });
      
      expect(genre).not.toBeNull();
    });
    
    // Testing the data is in the body of the response
    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
});
