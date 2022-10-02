// const winston = require('winston');
const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, colorize } = format;
require('winston-mongodb');
require('express-async-errors');

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}  ${level} - [${label}] ${message}`;
});

  // handle uncaught exception
  // process.on("uncaughtException", (ex) => {
  //   console.log("WE GOT AN  UNCOUGHT EXCEPTION");
  //   winston.error(ex.message, { metadata: ex });
  // })

  // Use the winston helper method
  // winston.exceptions.handle(new winston.transports.File({ filename: 'uncaoughtExceptions.log' }));

  // handle unhandle rejection
  // process.on("unhandledRejection", (ex) => {
  //   throw ex;
    // console.log("WE GOT AN UNHANDLE REJECTION");
    // winston.error(ex.message, { metadata: ex });
  // })

  // add a "transport" for winston logger (File and console)
  // winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  // winston.add(new winston.transports.Console());
  // winston.add(new winston.transports.MongoDB({ 
  //   db: 'mongodb://localhost:27017/vidly',
  //   options: {
  //     useUnifiedTopology: true
  //   }
  // }));


const logger = new createLogger({
  level: "debug",
  format: combine(
    label({ label: 'Right Now!' }),
    timestamp(),
    // colorize(),
    myFormat
  ),
  transports: [
    new transports.File({ filename: 'logfile.log' }),
    new transports.Console({ colorize: true, prettyPrint: true }),
    new transports.MongoDB({
      db: 'mongodb://localhost:27017/vidly',
      options: {
        useUnifiedTopology: true
      }
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'uncaoughtExceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'unhandleRejection.log' })
  ]
});

// winston.addColors({
//         error: 'red',
//         warn: 'yellow',
//         info: 'cyan',
//         debug: 'green'
//     });

logger.info('This is a info statement');
logger.debug('This is a debug statement');
logger.warn('This is a warning statement');
logger.error('This is a error statement');

// throw new error on startup
// throw new Error("Something failed during startup.");

// reject a promise and throw an error message
// Promise.reject();
// const p = Promise.reject(new Error("Something failed miserably"));

exports.logger = logger;
