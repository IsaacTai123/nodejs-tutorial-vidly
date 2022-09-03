const { User, validate } = require('../modules/users');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');

router.get('', async (req, res) => {
  const results = await User.find().sort({ name: 1 });
  res.send(results);
})

router.post('', async (req, res) => {
  // check the input
  let { error } = validate(req.body);
  console.log("error: " + error);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if it exist
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered')

  // create new Document
  console.log("typeof User: " + typeof(User));
  user = new User(_.pick(req.body, [ 'name', 'email', 'password' ]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, [ '_id', 'name', 'email' ]));

})

module.exports = router;
