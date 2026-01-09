import jwt from "jsonwebtoken";

// Middleware để verify accessToken (dùng cho protected routes)
const AuthMiddleware = (req, res, next) => {
  try {
    // Chỉ lấy accessToken từ header
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({
        message: "Access token required",
        error: true,
        success: false,
      });
    }

    // Verify accessToken
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
    if (!decoded || !decoded._id) {
      return res.status(403).json({
        message: "Invalid access token",
        error: true,
        success: false,
      });
    }
    // Chỉ lưu data cần thiết, loại bỏ JWT metadata
    req.user = {
      _id: decoded._id,

      // Có thể thêm role nếu cần: role: decoded.role
    };
    console.log(req.user);
    next();
  } catch (error) {
    console.error("AuthMiddleware Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token expired",
        error: true,
        success: false,
        needRefresh: true, // Flag để frontend biết cần refresh
      });
    }

    return res.status(403).json({
      message: "Invalid access token",
      error: true,
      success: false,
    });
  }
};

// Middleware riêng để verify refreshToken (chỉ dùng cho refresh endpoint)
const RefreshTokenMiddleware = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required",
        error: true,
        success: false,
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    if (!decoded || !decoded.userId) {
      return res.status(403).json({
        message: "Invalid refresh token",
        error: true,
        success: false,
      });
    }
    // Chỉ lưu data cần thiết, loại bỏ JWT metadata
    req.user = {
      _id: decoded._id,
    };
    next();
  } catch (error) {
    console.error("RefreshTokenMiddleware Error:", error);
    return res.status(403).json({
      message: "Invalid refresh token",
      error: true,
      success: false,
    });
  }
};

export { AuthMiddleware, RefreshTokenMiddleware };
