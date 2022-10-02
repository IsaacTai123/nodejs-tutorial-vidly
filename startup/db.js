const mongoose = require("mongoose");
const winston = require("winston");

// Connect to DB
module.exports = function() {
  mongoose.connect("mongodb://localhost:27017/vidly")
    .then(() => winston.info('Connected to MongoDB...'))
}
