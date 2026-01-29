import { createClient } from "redis";

// Main Redis client for cache and operations
export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

// Separate Redis client for Pub/Sub subscriber
export const redisSubscriber = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("connect", () => {
  console.log("✅ Redis Client connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client error:", err);
});

redisSubscriber.on("connect", () => {
  console.log("✅ Redis Subscriber connected");
});

redisSubscriber.on("error", (err) => {
  console.error("❌ Redis Subscriber error:", err);
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  if (!redisSubscriber.isOpen) {
    await redisSubscriber.connect();
  }
};
