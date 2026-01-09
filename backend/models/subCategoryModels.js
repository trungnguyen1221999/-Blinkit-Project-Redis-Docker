import mongoose from "mongoose";
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
      required: true,
      unique: true,
    },
    image: {
       url: { type: String, default: "" }, // link ảnh Cloudinary
      public_id: { type: String, default: "" }, // dùng để xoá ảnh
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  { timestamps: true }
);

export const SubCategoryModels = mongoose.model(
  "SubCategory",
  subCategorySchema
);
