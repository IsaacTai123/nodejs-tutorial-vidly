const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', new mongoose.Schema({
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
}))

function validateUser(user) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(1024).required()
  })

  return schema.validate(user, { allowUnknown: true });
}

exports.User = User
exports.validate = validateUser
