const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
const logger = require('../startup/logging').logger;

// Connect to DB
module.exports = function() {
  const db = config.get('db');
  mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`))
}
