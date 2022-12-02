const express = require('express');
const router = express.Router();
const { Rental } = require('../modules/rental');
const { logger } = require('../startup/logging');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  logger.info(`Request data from test ${ req.body.customerId }`);
  console.log(`Request data from test ${ req.body.customerId }`);

  // console.log("[customerID: ] " + req.body.customerId);
  if (!req.body.customerId) return res.status(400).send('customerId not provided');
  if (!req.body.movieId) return res.status(400).send('movieId not provided');


  // TODO: access db
  const rental = await Rental.findOne({ 
    'customer._id': req.body.customerId, 
    'movie._id': req.body.movieId,
  });
  logger.info(`Response data from db ${ rental }`);
  if (!rental) return res.status(404).send("Rental not found");

  // already return 
  if (rental.dateReturned) return res.status(400).send('return already processed');
  
  
  res.status(200).send();
});

module.exports = router;
