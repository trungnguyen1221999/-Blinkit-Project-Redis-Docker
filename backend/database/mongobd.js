// Import các module cần thiết
import mongoose from "mongoose";

// Hàm kết nối tới MongoDB
export const connectDB = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL; // Lấy URL từ biến môi trường
    if (!mongoURI) {
      throw new Error("Thiếu DATABASE_URL trong file .env");
    }

    await mongoose.connect(mongoURI);

    console.log("✅ Kết nối tới MongoDB thành công!");
  } catch (err) {
    console.error("❌ Lỗi khi kết nối tới MongoDB:", err.message);
    process.exit(1); // Dừng server nếu kết nối thất bại
  }
};
