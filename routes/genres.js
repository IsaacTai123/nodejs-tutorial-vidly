const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {default: mongoose} = require("mongoose");

// const genres = [
//   { id: 1, name: "action" },
//   { id: 2, name: "horror" },
//   { id: 3, name: "comedy" },
// ];

// Connect to DB
mongoose.connect('mongodb://localhost/genres')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err))

// Create schema
const genresSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ['action', 'horror', 'comedy', 'documentary', 'adventure']
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
const Genres = mongoose.model('Genres', genresSchema);

// Create a instance of Genres class
async function createGenres() {
  const genres = new Genres({
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

// createGenres()

// ===============================
// Interact With DB
// ===============================
// get all genres
async function getGenres() {
  const genres = await Genres
    .find({
      author: /.*/
    })
    .limit(5)
    .sort({ name: 1 })
    .select({ name: 1, author: 1 })
  return genres;
}


// get genre by "id"
async function getGenresById(id) {
  const genre = await Genres
    .find({
      _id: id
    })
    .select({ name: 1, author: 1, tags: 1 })
  return genre;
}

// create new genre and store it inside db
async function createNewGenres(name, author, tags) {
  const genres = new Genres({
    name: name,
    author: author,
    tags: tags
  });

  // save genres to Document ** this is async, cause it need time to store data to db.
  const result = await genres.save();
  return result;
}

// update genres
async function updateGenres(id, tags, name) {
  const result = await Genres.updateOne( { _id: id }, { 
    $set: {
      tags: [ tags[0], tags[1] ],
      name: name
    }
  })
}

// delete genres
async function deleteGenres(id) {
  const result = await Genres.findByIdAndRemove({ _id: id });
  return result;
}




// ===============================
// Router
// ===============================
router.get("/", (req, res) => {
  const genres = getGenres();
  res.send(genres);
});

router.get("/:id", (req, res) => {
  // check if ID exist
  // const name = genres.find((c) => c.id === parseInt(req.params.id));
  // if (!name) return res.status(404).send("Genre with this ID is not exist");
  const genre = getGenresById(req.params.id)

  // get name
  res.send(genre);
});

router.post("/", (req, res) => {
  // Input Validation
  // const { error } = validateGenres(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  //
  // const genre = {
  //   id: genres.length + 1,
  //   name: req.body.name,
  // };
  //
  // // get post message
  // genres.push(genre);
  // res.send(genres);


});

router.put("/:id", (req, res) => {
  // check if ID exist
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre with this ID is not exist");

  // Input Validation
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update genres
  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  // check if ID exist
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre) return res.status(404).send("Genre with this ID is not exist");

  // delete genre
  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  // send the deleted genre
  res.send(genre);
});

function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(genre);
}

module.exports = router;
