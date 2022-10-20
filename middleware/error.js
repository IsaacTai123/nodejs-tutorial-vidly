// const winston = require('winston');
const { logger } = require('../startup/logging');

module.exports = function(err, req, res, next) {
  // Log the exception
  logger.error(err.message, { metadata: err });
  
  res.status(500).send("Something failed.");
}
