// Import required modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { connectDB } from "./database/mongobd.js";
import userRouter from "./routers/userRouter.js";
import routerCategory from "./routers/categoryRoutes.js";
import routerSubCategory from "./routers/subCategoryRoutes.js";
import productRouter from "./routers/productRouter.js";
import cartRouter from "./routers/cartRouter.js"; // Import cartRouter
import orderRouter from "./routers/orderRouters.js";
import {connectRedis, redisClient} from "./redisConnect.js";
import revenueRouter from "./routers/revenueRoutes.js";
import customerRouter from "./routers/customerRoutes.js";
import notificationRouter from "./routers/notificationRoutes.js";
import { subscribeRevenue } from "./pub/sub/subscriber.js";
// Load environment variables
dotenv.config();

// Create an instance of an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(express.json()); // parse JSON body
await connectRedis();

// 🚀 Start Redis Pub/Sub Revenue Subscriber
console.log("🔄 Starting Redis Pub/Sub Revenue Subscriber...");
await subscribeRevenue();
console.log("✅ Revenue Subscriber is now listening for events!");

app.use(cookieParser(process.env.COOKIE_SECRET)); // parse cookies
app.use(
  cors({
    origin: true, // Accept tất cả origins (chỉ để test)
    credentials: true, // allow sending cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP if you have inline scripts in frontend
  })
);
app.use(morgan("dev")); // log HTTP requests

// Routes
app.get("/", (req, res) => {
  res.send("✅ Server is running and CORS is enabled!");
});


app.post("/redis-test", async (req, res) => {
  try {
    const { key, value } = req.body;
    await redisClient.set(key, value);
    res.json({ key, value });
  }
  catch (error) {
    console.error("Error in /redis-test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/api/user", userRouter); // User routes
app.use("/api/category", routerCategory); // Category routes
app.use("/api/subcategory", routerSubCategory); // SubCategory routes
app.use("/api/product", productRouter); // Product routes
app.use("/api/cart", cartRouter); // Cart routes

app.use("/api/order", orderRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/customer", customerRouter);
app.use("/api/notifications", notificationRouter);
// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running at http://0.0.0.0:${PORT}`);
});
