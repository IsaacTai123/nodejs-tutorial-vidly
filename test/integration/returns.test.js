const { Rental } = require('../../modules/rental');
const { User } = require('../../modules/users');
const { Movie } = require('../../modules/movies');
const { logger } = require('../../startup/logging');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

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

    // create a movie to put into db
    movie = new Movie({ 
      _id: movieId,
      title: "the 2012",
      genre: { name: "horrific" },
      numberInStock: 4,
      dailyRentalRate: 2
    });
    await movie.save();
  });

  afterEach( async () => {
    await server.close();
    await Rental.remove({});
    await Movie.remove({});
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
 
  it('should set returnDate if input is valid', async () => {
    await exec();
    const rentalInDb = await Rental.findById(rental._id); 
    const diff = new Date() - rentalInDb.dateReturned
    expect(diff).toBeLessThan(10*1000);

    // expect(rentalInDb.dateReturned).toBeDefined();
  });

  it('should calculate the rental fee (numberOfDays * movie.dailyRentalRate)', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    await exec();

    const rentalInDb = await Rental.findById(rental._id); 
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it('should increse the stock ( add movie back to stock )', async () => {
    await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
   
  });

  // it('Return the rental', () => {
  //   
  // });
});
