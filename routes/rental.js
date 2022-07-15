const { Rental, validate } = require('../modules/rental');
const { Customer } = require('../modules/customers');
const { Movie } = require('../modules/movies');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const results = await Rental.find().sort({ dateOut: -1 });
  res.send(results);
})

router.post('/', async (req, res) => {
  // validate input
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // get customer info
  const customer = Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('invalid customer');

  // get movie info
  const movie = Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie');

  // check if the movie is available
  if (movie.numberInStock === 0) return res.status(400).send('Movie is not in stock');
  
  let rental = new Rental({
    customer: {
      id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
  });
  rental = await rental.save();
  
  movie.numberInStock--;
  movie.save();

  res.send(rental);
})

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.body.id);
  if (!rental) return res.status(404).send('Invalid rental Id');
  res.send(rental);
})

module.exports = router;
