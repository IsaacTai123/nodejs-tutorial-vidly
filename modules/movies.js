const Joi = require('joi');
const mongoose = require('mongoose')
const { genreSchema, Genre } = require('./genres');

// create movie model
const Movie = mongoose.model("movies", new mongoose.Schema({
  title: String,
  genre: genreSchema,
  numberInStock: Number,
  dailyRentalRate: Number
}));

// create movie
async function createMovie(genre) {
  const movie = new Movie({
    title: "Terminator",
    genre: genre,
    numberInStock: 0,
    dailyRentalRate: 0
  });

  const result = await movie.save();
  console.log(result);
}

async function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genre: Joi.object().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number()
  })

  return schema.validate(movie, { allowUnknown: true });
}

// createMovie( new Genre({
//    name: "action",
//    author: "John smith",
//    tags: [
//     "b",
//     "horror"
//    ],
//    isAvaliable: true,
//    price: 30,
// }));

exports.Movie = Movie;
exports.validate = validateMovie;

// console.log(`genreSchema: ${genreSchema}, validate: ${validate}, Genre: ${Genre} `);
