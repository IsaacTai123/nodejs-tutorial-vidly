const jwt = require('jsonwebtoken');
const config = require('config');
const util = require('util');

module.exports = function (req, res, next) {
  // check token exist
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send("Access denied, No token provided");

  // check token is valid
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    console.log('jwt decoded: ' + util.inspect(decoded, {depth: null}));  // print out object in console
    req.user = decoded;
    next();
  } catch (ex) {
    /* handle error */
    res.status(400).send('Invalid token');
  }
}
