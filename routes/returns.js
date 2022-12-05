const express = require('express');
const router = express.Router();
const Joi = require('joi');
const moment = require('moment');
const { Rental } = require('../modules/rental');
const { logger } = require('../startup/logging');
const { Movie } = require('../modules/movies');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');


router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  // logger.info(`Request data from test ${ req.body.customerId }`);

  // TODO: access db
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  // logger.info(`Response data from db ${ rental }`);
  if (!rental) return res.status(404).send("Rental not found");

  // already return 
  if (rental.dateReturned) return res.status(400).send('return already processed');
  // or update dateReturned
  rental.dateReturned = new Date();
  await rental.save();
  
  // calculate fee
  const diffs = moment().diff(rental.dateOut, 'days');
  // logger.info(`moment package: how many days after 11/30/22 ${ moment().diff(moment("2022-11-30"), 'days') }`)
  const fee = diffs * rental.movie.dailyRentalRate;
  rental.rentalFee = fee;
  await rental.save();
  
  // add movie back to stock
  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } })
  
  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });

  return schema.validate(req, { allowUnknown: true });
}

// logger.info(`From "returns.js type of validateReturn: [${ typeof(validateReturn) }]"`);

// module.exports.returns = router;
exports.returns = router;

console.log(module);
