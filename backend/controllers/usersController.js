import { UserModels } from "../models/userModels.js";
import bcrypt from "bcryptjs";
import resendEmail from "../resendEmail/resendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplet.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import uploadImageCloudinary from "../utils/uploadImageClodinary.js";
import generateOTP from "../utils/generateOTP.js";
import forgotPasswordEmailTemplet from "../utils/forgotPasswordEmailTemplet.js";
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({
        message: "Name, email and password are required",
        error: true,
        success: false,
      });
    const isExistingUser = await UserModels.findOne({ email });
    if (isExistingUser)
      return res
        .status(400)
        .json({ message: "User already exists", error: true, success: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = {
      name,
      email,
      password: hashedPassword,
    };
    const newUser = new UserModels(payload);
    await newUser.save();
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-successfully?id=${newUser?._id}`;
    await resendEmail(
      email,
      "Please verify your email",
      verifyEmailTemplate(name, verifyUrl)
    );
    return res.status(201).json({
      message: "User registered successfully and Verification email sent",
      error: false,
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false,
      });

    const user = await UserModels.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User or password is incorrect",
        error: true,
        success: false,
      });
    if (!user.verify_email || user.status !== "Active")
      return res.status(403).json({
        message: "Your account is not active or has been suspended",
        error: true,
        success: false,
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(404).json({
        message: "User or password is incorrect",
        error: true,
        success: false,
      });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({
      message: "User logged in successfully",
      error: false,
      success: true,
      data: {
        accessToken,
        id: user._id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const verifiedEmail = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);
    const user = await UserModels.findById(id);
    if (!user)
      res
        .status(404)
        .json({ message: "User not found", error: true, success: false });
    await UserModels.updateOne({ _id: id }, { verify_email: true });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({
      message: "Email verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const image = req.file;
    const upload = await uploadImageCloudinary(image);
    const updateUser = await UserModels.findByIdAndUpdate(
      userId,
      { avatar: upload.url },
      { new: true }
    );
    return res.status(200).json({
      message: "Upload avatar successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.status(200).json({
      message: "User logged out successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { userId } = req.user;
    const newAccessToken = generateAccessToken(userId);
    res.status(200).json({
      message: "Access token refreshed successfully",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

const editUser = async (req, res) => {
  try {
    const { _id } = req.user; // lấy từ AuthMiddleware
    const userId = req.params.id; // id của user cần chỉnh sửa
    if (!userId) {
      return res.status(400).json({
        message: "User id to edit is required",
        error: true,
        success: false,
      });
    }

    if (!_id)
      return res.status(400).json({
        message: "User id is required",
        error: true,
        success: false,
      });
    const foundUser = await UserModels.findById(_id);
    if (foundUser.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
        error: true,
        success: false,
      });
    }
    const { name, email, mobile, password, avatar, role, verify_email } =
      req.body;

    // Nếu tất cả đều rỗng thì báo lỗi
    if (!name && !email && !mobile && !password && !role && !verify_email)
      return res.status(400).json({
        message: "At least one field is required to update",
        error: true,
        success: false,
      });

    // Tạo object update rỗng
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (mobile) updateFields.mobile = mobile;
    if (password) updateFields.password = bcrypt.hashSync(password, 10);
    if (role) updateFields.role = role;
    if (verify_email !== undefined) updateFields.verify_email = verify_email;

    const user = await UserModels.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json({
      message: "User updated successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      return res.status(400).json({
        message: "User id is required",
        error: true,
        success: false,
      });
    }
    const idToDelete = req.params.id;
    await UserModels.findByIdAndDelete(idToDelete);
    res.status(200).json({
      message: "User deleted successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    const isEmailExist = await UserModels.findOne({ email });
    if (!isEmailExist)
      return res.status(404).json({
        message: "User does not exist",
        error: true,
        success: false,
      });
    // Logic gửi email đặt lại mật khẩu sẽ được triển khai ở đây
    const otp = generateOTP().toString();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // OTP hợp lệ trong 5 phút
    await UserModels.updateOne(
      { email },
      { forgot_password_opt: otp, forgot_password_expiry: expiryTime }
    );
    await resendEmail(
      email,
      "Your Password Reset OTP",
      forgotPasswordEmailTemplet(isEmailExist.name, otp)
    );
    return res.status(200).json({
      message: "OTP sent to email successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({
        message: "Email, OTP and new password are required",
        error: true,
        success: false,
      });
    const user = await UserModels.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        error: true,
        success: false,
      });
    if (
      user.forgot_password_opt !== otp ||
      new Date() > new Date(user.forgot_password_expiry)
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "OTP verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword)
      return res.status(400).json({
        message: "Email, new password and confirm password are required",
        error: true,
        success: false,
      });
    const user = await UserModels.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        error: true,
        success: false,
      });
    if (newPassword !== confirmPassword)
      return res.status(400).json({
        message: "Password and confirm password do not match",
        error: true,
        success: false,
      });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const newUser = await UserModels.updateOne(
      { email },
      {
        password: hashedPassword,
        forgot_password_opt: null,
        forgot_password_expiry: null,
      }
    );
    return res.status(200).json({
      message: "Password updated successfully",
      data: newUser,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    const user = await UserModels.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User does not exist",
        error: true,
        success: false,
      });
    if (user.verify_email) {
      return res.status(400).json({
        message: "Email is already verified",
        error: true,
        success: false,
      });
    }
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-successfully?id=${user?._id}`;
    resendEmail(
      email,
      "Please verify your email",
      verifyEmailTemplate(user.name, verifyUrl)
    );
    return res.status(200).json({
      message: "Verification email sent successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModels.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

const changePassword = async (req, res) => {
  const { _id } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await UserModels.findById(_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
        error: true,
        success: false,
      });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
        error: true,
        success: false,
      });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
        error: true,
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      message: "Password changed successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
const editName = async (req, res) => {
  const { _id } = req.user;
  const { name } = req.body;

  try {
    if (!_id)
      return res.status(400).json({
        message: "User id is required",
        error: true,
        success: false,
      });
    if (!name)
      return res.status(400).json({
        message: "Name is required",
        error: true,
        success: false,
      });

    const user = await UserModels.findByIdAndUpdate(
      _id,
      { name },
      { new: true }
    );
    res.status(200).json({
      message: "Name updated successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      return res.status(400).json({
        message: "User id is required",
        error: true,
        success: false,
      });
    }
    const user = await UserModels.findById(_id);
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
        error: true,
        success: false,
      });
    }
    const users = await UserModels.find().select("-password");
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found",
        error: true,
        success: false,
      });
    }
    res.status(200).json({
      message: "Users fetched successfully",
      error: false,
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({
        message: "name, email, password, role cant be empty",
        error: true,
        success: false,
      });
    const isExistUser = await UserModels.findOne({ email });
    if (isExistUser)
      return res
        .status(400)
        .json({ message: "User already exists", error: true, success: false });
    const user = new UserModels({ name, email, password, role });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
};

export {
  registerUser,
  loginUser,
  editUser,
  deleteUser,
  verifiedEmail,
  logoutUser,
  refreshAccessToken,
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
};
