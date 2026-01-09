import jwt from "jsonwebtoken";
import { UserModels } from "../models/userModels.js";
import dotenv from "dotenv";
dotenv.config();
const generateAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "5h",
  });
};

const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    { _id: userId },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  await UserModels.findByIdAndUpdate(
    userId,
    { refreshToken: refreshToken },
    { new: true }
  );
  return refreshToken;
};

export { generateAccessToken, generateRefreshToken };
