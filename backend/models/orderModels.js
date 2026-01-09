import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Không bắt buộc, cho phép guest
    },
    guestId: {
      type: String,
      required: false, // Nếu là guest thì lưu guestId
    },
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      unique: true,
    },
    productId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    product_detail: [{
      name: String,
      image: Array,
      quantity: Number,
      price: Number
    }],
    paymentId: {
      type: String,
      unique: true,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded", "Abandon Checkout"],
      default: "Pending",
    },
    delivery_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const OrderModels = mongoose.model("Order", orderSchema);
