import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    userId: {
      type: String, // Dùng cho cả userId và guestId
      required: true,
    },
  },
  { timestamps: true }
);

export const CartProductModels = mongoose.model(
  "CartProduct",
  cartProductSchema
);
