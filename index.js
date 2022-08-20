const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const express = require("express");
const app = express();
// const Fawn = require("fawn");

// Connect to DB
mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log('Could not connect to MongoDB...', err))

// Fawn.init(mongoose);

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);

const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`Listening on port : ${port}`));
