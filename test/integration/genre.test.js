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
    let genre;

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name: name });
    };

    beforeEach( async () => {
      genre = new Genre({ name: 'before' });
      await genre.save();

      token = new User().generateAuthToken();
      id = genre._id;
      name = 'updatedName';
    });

    it('should return 401 if client is not login', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    })

    it('should return 400 if genre is less than 5 characters', async () => {
      name = 'gen';
     
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');
     
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if ID is invalid', async () => {
      id = 1;

      const res = await exec();

      // check the name has been changed
      expect(res.status).toBe(404);
    });

    it('should return 404 if ID is not exists', async () => {
      id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();
  
      // check the name has been changed
      expect(res.status).toBe(404);
    });

    it('should return updated genre if id is exist', async () => {
      const res = await exec();
  
      // check the name has been changed
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'updatedName');
    });
  });

  describe('DELETE /:id', () => {

    let id;
    let genre;
    let token;

    beforeEach( async () => {
      genre = new Genre({ name: 'genre_2' });
      await genre.save();

      id = genre._id;
      let user = new User({ isAdmin: true });
      token = new User(user).generateAuthToken();
    });

    const exec = async () => {
      return await request(server)
        .del('/api/genres/'+id)
        .set('x-auth-token', token)
        .send();
    }

    it('should return 401 if client is not login', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if user is not admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if given ID is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with the given id was found', async () => {
      id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return genre if it is delete successfully', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it('should return null when checking db', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('should return genre if delete has done', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    })
  });
});
