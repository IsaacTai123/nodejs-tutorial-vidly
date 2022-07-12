const { Movie, validate } = require('../modules/movies');
const express = require('express');
const router = express.Router();
const { Genre } = require("../modules/genres");

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
  if (error) return res.status(400).send(error.details[0].message);

  // check the genreId which user pass in is valid.
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  movie = await movie.save();
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = await Movie.findOneAndUpdate({ _id: req.params.id }, {
    $set: {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
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
