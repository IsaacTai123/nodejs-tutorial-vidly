const config = require('config');

module.exports = function() {
  // check if env variable is set. if not then terminate the app
  if (!config.get("jwtPrivateKey")) {
    throw new Error('FAFAL Error: jwtPrivateKey is not defined');
  }
}
