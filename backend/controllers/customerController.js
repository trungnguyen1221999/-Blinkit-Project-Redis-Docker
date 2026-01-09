import { CustomerModels } from '../models/customerModels.js';

// Create customer
export const createCustomer = async (req, res) => {
  try {
    const customer = new CustomerModels(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await CustomerModels.find().populate('orders');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single customer
export const getCustomer = async (req, res) => {
  try {
    const customer = await CustomerModels.findById(req.params.id).populate('orders');
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const customer = await CustomerModels.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await CustomerModels.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
