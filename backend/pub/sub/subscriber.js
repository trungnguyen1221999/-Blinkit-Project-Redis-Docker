import { redisSubscriber, redisClient, connectRedis } from "../../redisConnect.js";

export const subscribeRevenue = async () => {
    try {
        await connectRedis();
        
        // Subscribe to channel using dedicated subscriber client
        await redisSubscriber.subscribe("revenueChannel", async (message) => {
            try {
                const data = JSON.parse(message);
                console.log("📊 New revenue update:", data);
                
                // Tạo notification và lưu vào Redis
                const notification = {
                    id: `noti_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: 'new_order',
                    title: 'New Order Received!',
                    message: `Order #${data.orderID} - Amount: $${data.amount}`,
                    orderId: data.orderID,
                    amount: data.amount,
                    userName: data.userName,
                    timestamp: data.timestamp || new Date().toISOString(),
                    read: false,
                    priority: 'high'
                };
                
                // Lưu vào Redis list (notifications:admin) using main client
                await redisClient.lPush('notifications:admin', JSON.stringify(notification));
                
                // Giữ chỉ 50 notifications gần nhất
                await redisClient.lTrim('notifications:admin', 0, 49);
                
                console.log("✅ Notification saved:", notification.title);
                
            } catch (error) {
                console.error("❌ Error parsing revenue message:", error);
            }
        });
        
        console.log("✅ Subscribed to revenueChannel");
    } catch (error) {
        console.error("❌ Error subscribing to revenue channel:", error);
    }
}