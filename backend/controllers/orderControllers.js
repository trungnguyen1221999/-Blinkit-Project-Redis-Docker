// Create abandon order (temp order when user visits checkout)
export const createAbandonOrder = async (req, res) => {
  try {
    const { userId, cartProducts, totalAmt } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    // Check if user already has an abandon order
    const exist = await OrderModels.findOne({ userId, payment_status: 'Abandon Checkout' });
    if (exist) return res.status(200).json(exist);
    // Create temp order
    const order = new OrderModels({
      userId,
      payment_status: 'Abandon Checkout',
      product_detail: Array.isArray(cartProducts) ? cartProducts : [cartProducts],
      productId: Array.isArray(cartProducts) ? cartProducts.map(p => p._id) : [cartProducts._id],
      totalAmt: totalAmt || 0,
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      invoice_receipt: `INV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    });
    await order.save();
    // Push to user.orderHistory
    const UserModels = (await import('../models/userModels.js')).UserModels;
    await UserModels.findByIdAndUpdate(userId, { $push: { orderHistory: order._id } });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update abandon order to completed
export const completeAbandonOrder = async (req, res) => {
  try {
    const { userId, orderId, paymentId, product_detail, totalAmt } = req.body;
    const order = await OrderModels.findOneAndUpdate(
      { userId, orderId, payment_status: 'Abandon Checkout' },
      {
        payment_status: 'Completed',
        paymentId,
        product_detail: Array.isArray(product_detail) ? product_detail : [product_detail],
        productId: Array.isArray(product_detail) ? product_detail.map(p => p._id) : [product_detail._id],
        totalAmt,
      },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Abandon order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
import { OrderModels } from '../models/orderModels.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    // Cho phép tạo đơn hàng với userId hoặc guestId
    const { userId, guestId, ...rest } = req.body;
    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId is required' });
    }
    // Ensure product_detail and productId are arrays
    let product_detail = rest.product_detail;
    let productId = rest.productId;
    if (product_detail && !Array.isArray(product_detail)) product_detail = [product_detail];
    if (productId && !Array.isArray(productId)) productId = [productId];
    const order = new OrderModels({ userId, guestId, ...rest, product_detail, productId });
    await order.save();
    // Nếu có userId thì push order._id vào user.orderHistory
    if (userId) {
      const UserModels = (await import('../models/userModels.js')).UserModels;
      await UserModels.findByIdAndUpdate(
        userId,
        { $push: { orderHistory: order._id } },
        { new: true }
      );
    }
    // Tạo customer nếu chưa có
    const { fullName, email, phone, address, city, postalCode } = rest;
    const { CustomerModels } = await import('../models/customerModels.js');
    let customerQuery = userId ? { userId } : { guestId };
    let exist = await CustomerModels.findOne(customerQuery);
    if (!exist) {
      const newCustomer = new CustomerModels({
        userId,
        guestId,
        name: fullName,
        email,
        phone,
        address,
        city,
        postalCode,
        orders: [order._id]
      });
      await newCustomer.save();
    } else {
      // Nếu đã có thì push thêm order vào orders
      await CustomerModels.findByIdAndUpdate(exist._id, { $push: { orders: order._id } });
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Orders
export const getOrders = async (req, res) => {
  try {
    // Có thể lọc theo userId hoặc guestId nếu truyền query
    const { userId, guestId } = req.query;
    if (userId) {
      // Nếu có userId, lấy user và populate orderHistory
      const UserModels = (await import('../models/userModels.js')).UserModels;
      const user = await UserModels.findById(userId).populate({
        path: 'orderHistory',
        populate: { path: 'productId userId delivery_address' }
      });
      res.json(user?.orderHistory || []);
    } else {
      // Nếu là guest hoặc không có userId, lấy theo guestId như cũ
      let filter = {};
      if (guestId) filter.guestId = guestId;
      const orders = await OrderModels.find(filter).populate('userId productId delivery_address');
      res.json(orders);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Order
export const getOrder = async (req, res) => {
  try {
    const order = await OrderModels.findById(req.params.id).populate('userId productId delivery_address');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Order
export const updateOrder = async (req, res) => {
  try {
    const order = await OrderModels.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModels.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
