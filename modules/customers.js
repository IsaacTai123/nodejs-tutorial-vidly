const Joi = require('joi');
const {Mongoose, default: mongoose} = require('mongoose');

// create schema
const customer = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false
  },
  name: { 
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: { 
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
})

// Create model
const Customer = mongoose.model('Customer', customer);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(10).required(),
    isGold: Joi.boolean()
  })

  return schema.validate(customer, { allowUnknown: true });
}

exports.Customer = Customer;
exports.validate = validateCustomer;
