const express = require('express');
const {custom} = require('joi');
const Joi = require('joi');
const router = express.Router();
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


// ---------------
// Router
// ---------------
router.get('/', async (req, res) => {
  const customer = await Customer.find().sort('name');
  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("Customer with this ID is not exist")
  res.send(customer);
});

router.post('/', async (req, res) => {
  // Input validated
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  customer = await customer.save();

  res.send(customer);
});

router.put('/:id', (req, res) => {
  // Input validated
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  // update customer
  const customer = Customer.findOneAndUpdate({ _id: req.params.id }, { 
    $set: {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    }
  }, { new: true })

  // Check if customer is null
  if (!customer) return res.status(404).send("Customer with this ID is not exist");

  res.send(customer);
});

router.delete('/:id', (req, res) => {
  const customer = Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send("Customer with this ID is not exist");
  res.send(customer);
});

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(10).required(),
    isGold: Joi.boolean()
  })

  return schema.validate(customer, { allowUnknown: true });
}

module.exports = router
