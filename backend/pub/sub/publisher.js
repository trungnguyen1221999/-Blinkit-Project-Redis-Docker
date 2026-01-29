import { redisClient, connectRedis } from "../../redisConnect.js";

export const publishRevenue = async (orderID, amount, userName = null) => {
    try {
        await connectRedis();
        
        const revenueData = { 
            orderID, 
            amount, 
            userName,
            timestamp: new Date().toISOString(),
            event: 'new_order'
        };
        
        await redisClient.publish("revenueChannel", JSON.stringify(revenueData));
        console.log('📈 Published revenue event:', revenueData);
        
        return true;
    } catch (error) {
        console.error('❌ Error publishing revenue:', error);
        return false;
    }
}