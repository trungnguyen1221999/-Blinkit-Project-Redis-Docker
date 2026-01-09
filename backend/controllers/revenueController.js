import { OrderModels } from '../models/orderModels.js';
import { RevenueModels } from '../models/revenueModels.js';

// Get revenue by day/month/year or by range
export const getRevenue = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let match = { payment_status: 'Completed' };
    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (type === 'day') {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      match.createdAt = { $gte: start, $lt: end };
    } else if (type === 'month') {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      match.createdAt = { $gte: start, $lt: end };
    } else if (type === 'year') {
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear() + 1, 0, 1);
      match.createdAt = { $gte: start, $lt: end };
    }
    const orders = await OrderModels.find(match);
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmt || 0), 0);
    res.json({ totalRevenue, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
