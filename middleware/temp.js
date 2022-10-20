const { createLogger, transports } = require("winston");
const winston = require('winston');
const mongoose = require('mongoose');
require('winston-mongodb');
// require('express-async-errors');



const logger = new createLogger({
  transports: [
    new transports.File({ filename: './logfile.log' }),
    new transports.Console(),
    new transports.MongoDB({
      db: 'mongodb://localhost:27017/vidly',
      options: {
        useUnifiedTopology: true
      }
    })
  ],
  rejectionHandlers: [
    new transports.File({ filename: './testRejectHandler.log' })
  ]
});

// winston.add(new winston.transports.File({
//   filename: './rejection2.log',
//   handleRejections: true
// }));

// winston.add(new winston.transports.File({ filename: 'logfile.log' }));
// winston.add(new winston.transports.Console());
// winston.add(new winston.transports.MongoDB({ 
//   db: 'mongodb://localhost:27017/vidly',
//   options: {
//     useUnifiedTopology: true
//   }
// }));

logger.info("hello this is logger info")

mongoose.connect("mongodb://localhost:27017/vidly")
  .then(() => logger.info('Connected to MongoDB...'))

// winston.add(new winston.transports.File({
//   filename: './testRejectHandler.log', 
//   handleRejections: true
// }));

// const logger = new createLogger();
// logger.rejections.handle(
//      new transports.File({ filename: 'testRejectHandler.log' })
// );

// winston.rejections.handle(
//   new winston.transports.File({ filename: './rejections.log' })
// );
