const Joi = require('joi');
const { User } = require('../modules/users');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const passwordComplexity = require("joi-password-complexity");
const complexityOptions = {
  min: 8,
  max: 1024,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4
};

// router.get('', async (req, res) => {
//   const results = await User.find().sort({ name: 1 });
//   res.send(results);
// })

router.post('', async (req, res) => {
  // check the input
  let { error } = validate(req.body);
  console.log("error: " + error);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exist
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.') // Do not tell user the explicit error 

  // check if pwd correct
  const validPwd = await bcrypt.compare(req.body.password, user.password)
  if (!validPwd) return res.status(400).send('Invalid email or password.') // Do not tell user the explicit error

  res.send(true);
})

function validate(req) {
  const schema = new Joi.object({
    email: Joi.string().email().required(),
    password: passwordComplexity(complexityOptions).required()
  });

  return schema.validate(req, { allowUnknown: true });
}

module.exports = router;
