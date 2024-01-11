const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secretKey = crypto.randomBytes(64).toString("hex");
const authenticateToken = (req, res, next) => {
  // Lấy token từ header
  const token = req.headers.authorization;

  if (token) {
    // Xác thực token
    const tokenValue = token.split(" ")[1];
    jwt.verify(tokenValue, "130599", (err, decoded) => {
      if (err) {
        // Token không hợp lệ
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        // Token hợp lệ, lưu thông tin người dùng vào req để sử dụng trong hàm xử lý getUserById
        req.user = decoded;
        next();
      }
    });
  } else {
    // Không tìm thấy token trong header
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authenticateToken;
