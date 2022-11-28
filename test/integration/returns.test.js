const { Rental } = require('../../modules/rental');
const mongoose = require('mongoose');
const request = require('supertest');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;

  beforeEach( async () => { 
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: 'abcdef',
        dailyRentalRate: 2
      }
    })

    await rental.save();

  });

  afterEach( async () => {
    await server.close();
    await Rental.remove({});
  });
  
  it('should work', async () => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });

  it('should return 401 if client is not logged in', async () => {
    const res = await request(server)
      .post('/api/returns')
      .send({ customerId: customerId, movieId: movieId });

    expect(res.status).toBe(401);
  });

  // it('Return 400 if customerId is not provided', () => {
  //   
  // });
  //
  // it('Return 400 if movieId is not provided', () => {
  //   
  // });
  //
  // it('Return 404 if no rental found for this customer/movie', () => {
  //   
  // });
  //
  // it('Return 400 if rental already process(customer already return the movie)', () => {
  //   
  // });
  //
  // it('Return 200 if valid request', () => {
  //   
  // });
  //
  // it('Set return date', () => {
  //   
  // });
  //
  // it('Calculate the rental fee', () => {
  //   
  // });
  //
  // it('Increse the stock ( add movie back to stock )', () => {
  //   
  // });
  //
  // it('Return the rental', () => {
  //   
  // });
});
