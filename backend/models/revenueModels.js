import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
  {
    totalRevenue: {
      type: Number,
      default: 0,
    },
    orders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    }],
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const RevenueModels = mongoose.model("Revenue", revenueSchema);
