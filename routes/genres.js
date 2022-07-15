const { Genre, validate } = require("../modules/genres");
const express = require("express");
const router = express.Router();


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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name
    // author: req.body.author,
    // tags: req.body.tags,
    // isAvaliable: req.body.isAvaliable,
    // price: req.body.price
  })
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", async (req, res) => {
  // Input Validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // update genre
  const genre = await Genre.findOneAndUpdate({ _id: req.params.id }, { 
    $set: {
      // tags: req.body.tags,
      name: req.body.name
      // author: req.body.author
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


module.exports = router;
