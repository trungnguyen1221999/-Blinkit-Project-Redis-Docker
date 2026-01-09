import { Router } from "express";
import {
  registerUser,
  loginUser,
  editUser,
  deleteUser,
  logoutUser,
  refreshAccessToken,
  verifiedEmail,
  uploadAvatar,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  sendVerificationEmail,
  getUser,
  changePassword,
  editName,
  getAllUsers,
  addUser,
} from "../controllers/usersController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

// POST /api/user/register - Đăng ký user mới
userRouter.post("/register", registerUser);
userRouter.post("/verify-successfully", verifiedEmail);

// POST /api/user/login - Đăng nhập user
userRouter.post("/login", loginUser);
userRouter.post("/logout", AuthMiddleware, logoutUser);
userRouter.post("/refresh-accessToken", AuthMiddleware, refreshAccessToken);
// PUT /api/user/edit/:id - Chỉnh sửa thông tin user
userRouter.put("/admin/edit/:id", AuthMiddleware, editUser);
userRouter.put(
  "/upload-avatar, authMiddleware",
  upload.single("avatar"),
  uploadAvatar
);
userRouter.put("/forgot-password", forgotPassword);
userRouter.put("/verify-forgot-password-otp", verifyForgotPasswordOTP);
userRouter.put("/reset-password", resetPassword);
// DELETE /api/user/delete/:id - Xóa user
userRouter.delete("/admin/delete/:id", AuthMiddleware, deleteUser);

userRouter.post("/resend-verification-email", sendVerificationEmail);
userRouter.get("/check-auth", AuthMiddleware, (req, res) => {
  return res.status(200).json({
    message: "User is authenticated",
    error: false,
    success: true,
    userId: req.user._id, // ✅ thêm userId riêng
  });
});
userRouter.get("/user-info/:id", getUser);
userRouter.put("/change-password", AuthMiddleware, changePassword);
userRouter.put(
  "/upload-avatar",
  AuthMiddleware,
  upload.single("avatar"),
  uploadAvatar
);

userRouter.put("/change-name", AuthMiddleware, editName);
userRouter.get("/admin/all-users", AuthMiddleware, getAllUsers);
userRouter.post("/admin/add-user", AuthMiddleware, addUser);

export default userRouter;
