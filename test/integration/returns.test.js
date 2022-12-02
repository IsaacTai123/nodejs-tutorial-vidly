const { Rental } = require('../../modules/rental');
const { User } = require('../../modules/users');
const mongoose = require('mongoose');
const request = require('supertest');
const { logger } = require('../../startup/logging');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  beforeEach( async () => { 
    server = require('../../index');

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

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
    });

    await rental.save();
  });

  afterEach( async () => {
    await server.close();
    await Rental.remove({});
  });

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId: customerId, movieId: movieId });
  }
  
  it('should work', async () => {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });

  it('should return 401 if client is not logged in', async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = "";
    const res = await exec();

    expect(res.status).toBe(400);

  });

  it('should return 404 if no rental found for this customer/movie', async () => {
    // customerId = mongoose.Types.ObjectId();
    // movieId = mongoose.Types.ObjectId();
    await Rental.remove({});

    const res = await exec();
    
    expect(res.status).toBe(404);
  });

  it('Return 400 if rental already process(customer already return the movie)', async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res =  await exec();
    
    expect(res.status).toBe(400);
  });

  it('should return 200 if valid request', async () => {
    const res = await exec();

    // console.log(res.error.text);
    expect(res.status).toBe(200);
  });
 
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
