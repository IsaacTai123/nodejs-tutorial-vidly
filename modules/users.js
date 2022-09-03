const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');
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

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,  // because the hash code will be a longer string
    unique: true
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema)



function validateUser(user) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    // password: Joi.string().min(5).max(1024).required()
    password: passwordComplexity(complexityOptions).required()
  });

  return schema.validate(user, { allowUnknown: true });
}

exports.User = User
exports.validate = validateUser
