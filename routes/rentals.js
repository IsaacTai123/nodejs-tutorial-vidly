const auth = require('../middleware/auth');
const { Rental, validate } = require('../modules/rental');
const { Customer } = require('../modules/customers');
const { Movie } = require('../modules/movies');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
// const Fawn = require("fawn");

// Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const results = await Rental.find().sort({ dateOut: -1 });
  res.send(results);
})

router.post('/', auth, async (req, res) => {
  // validate input
  const { error } = validate(req.body);
  console.log(error);
  console.log(req.body)
  if (error) return res.status(400).send(error.details[0].message);

  // get customer info
  const customer = await Customer.findById(req.body.customerId);  // *** do not forget to use await
  console.log(customer);
  if (!customer) return res.status(400).send('invalid customer');

  // get movie info
  const movie = await Movie.findById(req.body.movieId); // *** do not forget to use await
  console.log(movie);
  if (!movie) return res.status(400).send('Invalid movie');

  // check if the movie is available
  if (movie.numberInStock === 0) return res.status(400).send('Movie is not in stock');
  
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
  });

  // =======================================
  rental = await rental.save();

  movie.numberInStock--;
  movie.save();
  
  // convert these two operation to transactions using "Fawn" package
  // try {
  //   new Fawn.Task()
  //     .save('rentals', rental)  // save rental object to MongoDB rentals collections.
  //     .update('movies', { _id: movie._id }, { 
  //       $inc: { numberInStock: -1 }
  //     })
  //     .run();
  // }
  // catch {
  //   res.status(500).send('Something failed'); // internal server error
  // }
  
  // =======================================

  res.send(rental);
})

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.body.id);
  if (!rental) return res.status(404).send('Invalid rental Id');
  res.send(rental);
})

module.exports = router;
