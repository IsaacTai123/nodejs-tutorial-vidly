// const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'right isaac!' }),
    timestamp(),
    printf(({ level, message, label, timestamp }) => {
      return `${timestamp}  [${label}] ${level}: ${message}`;
    })
    // winston.format.json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = function(err, req, res, next) {
  // Log the exception
  // winston.error(err.message, err);
  logger.info("Hello distributed log files.");
  // logger.log({
  //   level: 'error',
  //   message: "Hello distributed log files"
  // });
  
  res.status(500).send("Something failed.");
}
