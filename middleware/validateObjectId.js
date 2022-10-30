const mongoose = require('mongoose');

module.exports = function(req, res, next) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid ID');

  // if the ID is valid we will pass control to the next middleware function.
  // in this case is "route handler"
  next();
}
