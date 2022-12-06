const helmet = import('helmet');
const compression = import('compression');

module.exports = function(app) {
  app.use(helmet());
  app.use(compression());
}
