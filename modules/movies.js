const Joi = require('joi');
const mongoose = require('mongoose')
const { genreSchema, Genre } = require('./genres');

// create movie model
const Movie = mongoose.model("movies", new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  genre: { 
    type: genreSchema,
    required: true
  },
  numberInStock: { 
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true
  }
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

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.string().required(),  // Joi schema is what client send us, that the input to our API.
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
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
