const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // check token exist
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send("Access denied, No token provided");

  // check token is valid
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    console.log('jwt decoded: ' + decoded);
    req.user = decoded;
    next();
  } catch (ex) {
    /* handle error */
    res.status(400).send('Invalid token');
  }
}
