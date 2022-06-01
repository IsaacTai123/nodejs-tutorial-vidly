const express = require("express");
const router = express.Router();
const Joi = require("joi");

const genres = [
  { id: 1, name: "action" },
  { id: 2, name: "horror" },
  { id: 3, name: "comedy" },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  // check if ID exist
  const name = genres.find((c) => c.id === parseInt(req.params.id));
  if (!name) return res.status(404).send("Genre with this ID is not exist");

  // get name
  res.send(name);
});

router.post("/", (req, res) => {
  // Input Validation
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  // get post message
  genres.push(genre);
  res.send(genres);
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
