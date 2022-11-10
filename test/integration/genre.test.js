const request = require('supertest');
const { Genre } = require('../../modules/genres');
const { User } = require('../../modules/users');
const mongoose = require('mongoose');
const util = require('util');

let server;

describe('/api/genres', () => {

  beforeEach(() => { server = require('../../index'); });
  afterEach( async () => { 
    await Genre.deleteMany({});
    await server.close(); 
  });

  describe('GET /', () => {
    it('should return all genres', async () => {
      // populate data in db
      await Genre.collection.insertMany([
        { name: 'Marry' },
        { name: 'Wendy' },
      ]);

      const res = await request(server).get('/api/genres');
      console.log('[res body]: ' + util.inspect(res.body, { depth: null }));

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

    it('should return 404 if no genre with the given ID exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genres/' + id);
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

  describe('PUT /:id', () => {

    let token;
    let name;
    let id;

    const exec = async () => {
      return await request(server)
        .put(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send({ name: name });
    };

    beforeEach( async () => {
      const genre = new Genre({ 
        _id: mongoose.Types.ObjectId().toHexString(),
        name: 'before'
      });
      await genre.save();

      token = new User().generateAuthToken();
      id = genre._id;
    });

    it('should return 401 if no token has provided', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    })

    it('should return 400 if request is not valid', async () => {
      name = 'gen';
     
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return updated genre if id is exist', async () => {
      name = 'after';

      const res = await exec();
  
      // check the name has been changed
      expect(res.body).toHaveProperty('name', 'after');
    });

    it('should return 404 if genre ID is not exist', async () => {
      id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();
  
      // check the name has been changed
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {

    let id;

    beforeEach( async () => {
      let genre = new Genre({ 
        _id: mongoose.Types.ObjectId().toHexString(), 
        name: 'genre_2',
      });
      await genre.save();

      id = genre._id;
    });

    it('should return 401 if no token has provided', async () => {
      token = '';

      const res = await request(server)
        .del(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send();

      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      token = new User().generateAuthToken();

      console.log('[empty token]: ' + token);

      const res = await request(server)
        .del(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send();

      expect(res.status).toBe(403);
    });

    it('should return 404 if given ID is not exists', async () => {
      const user = ({ 
        _id: mongoose.Types.ObjectId().toHexString(),
        name: "johnSmith",
        email: "johnsmith@gmail.com",
        password: "1234TTA$",
        isAdmin: true
      });

      token = new User(user).generateAuthToken();
      let id = mongoose.Types.ObjectId().toHexString();

      const res = await request(server)
        .del(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send();

      expect(res.status).toBe(404);
    });

    it('should return genre if it is delete successfully', async () => {
      const user = ({ 
        _id: mongoose.Types.ObjectId().toHexString(),
        name: "johnSmith",
        email: "johnsmith@gmail.com",
        password: "1234TTA$",
        isAdmin: true
      });
      console.log('[user]: ' + user);

      token = new User(user).generateAuthToken();

      console.log('[token]: ' + token);
      console.log('[id]: ' + id);

      const res = await request(server)
        .del(`/api/genres/${id}`)
        .set('x-auth-token', token)
        .send();

      expect(res.status).toBe(200);
    });
  });
});
