const { Customer, validate } = require('../modules/customers');
const express = require('express');
const router = express.Router();

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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  customer = await customer.save();

  res.send(customer);
});

router.put('/:id', async (req, res) => {
  // Input validated
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message)

  // update customer
  const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, { 
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

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send("Customer with this ID is not exist");
  res.send(customer);
});

module.exports = router
