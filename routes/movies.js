const { Movie, validate } = require('../modules/movies');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movie = await Movie.find().sort("name");
  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send(`Movie with id ${req.params} is not exist`);
  res.send(movie);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  movie = await movie.save();
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const movie = await Movie.findOneAndUpdate({ _id: req.params.id }, {
    $set: {
      title: req.body.title,
      genre: req.body.genre,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }
  }, { new: true });

  if (!movie) return res.status(404).send(`Movie with id ${req.params} is not exist`);

  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send(`Movie with id ${req.params} is not exist`);
  res.send(movie);
})

module.exports = router;
