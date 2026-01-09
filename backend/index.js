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


// Load environment variables
dotenv.config();

// Create an instance of an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(express.json()); // parse JSON body

app.use(cookieParser(process.env.COOKIE_SECRET)); // parse cookies
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://kaiblinkit.netlify.app',
      'https://kai-blinkit.onrender.com'
    ],
    credentials: true, // allow sending cookies
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

app.use("/api/user", userRouter); // User routes
app.use("/api/category", routerCategory); // Category routes
app.use("/api/subcategory", routerSubCategory); // SubCategory routes
app.use("/api/product", productRouter); // Product routes
app.use("/api/cart", cartRouter); // Cart routes
import revenueRouter from "./routers/revenueRoutes.js";
import customerRouter from "./routers/customerRoutes.js";
app.use("/api/order", orderRouter);
app.use("/api/revenue", revenueRouter);
app.use("/api/customer", customerRouter);
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
