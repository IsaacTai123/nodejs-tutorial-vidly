const winston = require('winston');
require('express-async-errors');
const error = require('./middleware/error');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users")
const auth = require("./routes/auth")
const express = require("express");
const app = express();
// const Fawn = require("fawn");

// add a "transport" for winston logger (File and console)
winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.Console());

// check if env variable is set. if not then terminate the app
if (!config.get("jwtPrivateKey")) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1); //exit out the app if the value is not 0
}

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
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`Listening on port : ${port}`));
