import { redisClient } from '../redisConnect.js';

// Get admin notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await redisClient.lRange('notifications:admin', 0, -1);
    const parsedNotifications = notifications.map(n => JSON.parse(n));
    
    res.json({
      success: true,
      notifications: parsedNotifications
    });
  } catch (error) {
    console.error('❌ Error getting notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get all notifications
    const notifications = await redisClient.lRange('notifications:admin', 0, -1);
    
    // Update the specific notification
    const updated = notifications.map(n => {
      const notification = JSON.parse(n);
      if (notification.id === id) {
        notification.read = true;
      }
      return JSON.stringify(notification);
    });
    
    // Replace the list
    await redisClient.del('notifications:admin');
    if (updated.length > 0) {
      await redisClient.lPush('notifications:admin', ...updated);
    }
    
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) {
    console.error('❌ Error marking as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};