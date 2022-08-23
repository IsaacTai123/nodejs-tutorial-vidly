const { User, validate } = require('../modules/users');
const express = require('express');
const router = express.Router();

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
  user = new User({
    name: req.body.name,
    email: req.body.email,

    // TODO: password encryp
    password: req.body.password
  });

  await user.save();
  res.send(user);
})

module.exports = router;
