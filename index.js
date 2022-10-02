const winston = require('winston');
const express = require("express");
const app = express();

const logger = require('./startup/logging').logger;
require('./startup/validation')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/config')();


const port = process.env.PORT || 3500;
app.listen(port, () => logger.info(`Listening on port : ${port}`));
