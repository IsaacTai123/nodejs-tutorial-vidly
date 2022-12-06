const winston = require('winston');
const express = require("express");
const app = express();

const logger = require('./startup/logging').logger;
require('./startup/validation')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/prod')(app);


const port = process.env.PORT || 3500;
const server = app.listen(port, () => logger.info(`Listening on port : ${port}`));

module.exports = server;
