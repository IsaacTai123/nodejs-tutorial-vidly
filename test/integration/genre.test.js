const request = require('supertest');
const { Genre } = require('../../modules/genres');
let server = require('../../index');
const mongoose = require('mongoose');

describe('/api/genres', () => {

  beforeEach(() => { server = require('../../index'); });
  afterEach( async () => { 
    server.close(); 
    await Genre.remove({});
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
});
