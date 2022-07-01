// const Joi = require("joi");
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const {default: mongoose} = require("mongoose");

// Connect to DB
mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err))

app.use(express.json());
app.use(express.urlencoded());
app.use("/api/genres", genres);

const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`Listening on port : ${port}`));


