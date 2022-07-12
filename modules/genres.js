const mongoose = require("mongoose");
const Joi = require("joi");

// Create schema
const genreSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ['action', 'horror', 'comedy', 'documentary', 'adventure'],
    minlength: 5,
    maxlength: 50
  },
  author: { type: String },
  tags: {
    type: Array,
    // validate: {
    //   validator: function(v) {
    //     return v && v.length > 0;
    //   },
    //   message: "Genres need at least one tags"
    // }
  },
  isAvaliable: Boolean,
  price: {
    type: Number,
    // required: function() { return this.isAvaliable; },
    min: 0,
    max: 1000,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  date: { type: Date, default: Date.now },
})

// Create module
const Genre = mongoose.model('Genre', genreSchema);

function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    author: Joi.string().min(3).required()
  });

  return schema.validate(genre, { allowUnknown: true });
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenres;
