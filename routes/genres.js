const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {default: mongoose} = require("mongoose");

// const genres = [
//   { id: 1, name: "action" },
//   { id: 2, name: "horror" },
//   { id: 3, name: "comedy" },
// ];

// Create schema
const genreSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ['action', 'horror', 'comedy', 'documentary', 'adventure'],
    minlength: 5,
    maxlength: 50
  },
  author: { type: String , required: true },
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "Genres need at least one tags"
    }
  },
  isAvaliable: Boolean,
  price: {
    type: Number,
    required: function() { return this.isAvaliable; },
    min: 0,
    max: 1000,
    get: v => Math.round(v),
    set: v => Math.round(v)
  },
  date: { type: Date, default: Date.now },
})

// Create module
const Genre = mongoose.model('Genre', genreSchema);

// Create a instance of Genres class
async function createGenres() {
  const genres = new Genre({
    // name: ,
    // author: "Jolie Barrows",
    isAvaliable: true,
    // tags: ["a", "horror"]
  });

  try {
    // save genres to Document ** this is async, cause it need time to store data to db.
    const result = await genres.save();
    console.log(result);
  }
  catch (err) {
    for ($e in err.errors) {
      console.log(err.errors[$e].message);
    }
  }
}

// ===============================
// Router
// ===============================
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  // check if genre is null then return 404
  if (!genre) return res.status(404).send("Genre with this ID is not exist");

  // get name
  res.send(genre);
});

router.post("/", async (req, res) => {
  // Input Validation
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
    author: req.body.author,
    tags: req.body.tags,
    isAvaliable: req.body.isAvaliable,
    price: req.body.price
  })
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", async (req, res) => {
  // Input Validation
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update genre
  const genre = await Genre.findOneAndUpdate({ _id: req.params.id }, { 
    $set: {
      tags: req.body.tags,
      name: req.body.name,
      author: req.body.author
    }
  }, { new: true }) // get the updated object from the database

  // check if genre is null then return 404.
  if (!genre) return res.status(404).send("Genre with this ID is not exist");

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  // delete genre
  const genre = await Genre.findByIdAndRemove({ _id: req.params.id });

  // check if genre is null then return 404
  if (!genre) return res.status(404).send("Genre with this ID is not exist");

  // send the deleted genre
  res.send(genre);
});

function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    author: Joi.string().min(3).required()
  });

  return schema.validate(genre, { allowUnknown: true });
}

module.exports = router;
