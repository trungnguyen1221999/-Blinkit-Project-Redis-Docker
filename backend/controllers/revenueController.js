import { OrderModels } from '../models/orderModels.js';
import { publishRevenue } from '../pub/sub/publisher.js';

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
    
    res.json({ 
      success: true,
      totalRevenue, 
      ordersCount: orders.length,
      orders 
    });
  } catch (err) {
    console.error('❌ Revenue Controller Error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get real-time revenue stats (simplified version)
export const getRealtimeRevenue = async (req, res) => {
  try {
    // Calculate basic stats from database
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [todayOrders, monthOrders, allOrders] = await Promise.all([
      OrderModels.find({ 
        payment_status: 'Completed',
        createdAt: { $gte: startOfDay }
      }),
      OrderModels.find({ 
        payment_status: 'Completed',
        createdAt: { $gte: startOfMonth }
      }),
      OrderModels.find({ payment_status: 'Completed' })
    ]);

    const stats = {
      todayRevenue: todayOrders.reduce((sum, order) => sum + (order.totalAmt || 0), 0),
      monthRevenue: monthOrders.reduce((sum, order) => sum + (order.totalAmt || 0), 0),
      totalRevenue: allOrders.reduce((sum, order) => sum + (order.totalAmt || 0), 0),
      todayOrders: todayOrders.length,
      monthOrders: monthOrders.length,
      totalOrders: allOrders.length
    };

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ Realtime Revenue Error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

// Manual revenue event trigger (for testing pub/sub)
export const manualRevenueEvent = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'orderId and amount are required'
      });
    }

    // Publish revenue event for testing
    const success = await publishRevenue(orderId, amount);
    
    if (success) {
      res.json({
        success: true,
        message: 'Manual revenue event published successfully',
        data: { orderId, amount }
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to publish revenue event'
      });
    }
  } catch (err) {
    console.error('❌ Manual Revenue Event Error:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};
