import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // Check for token in both 'token' and 'Authorization' headers
    const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access token required" 
      });
    }

    try {
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      const expected = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;

      // Check if the decoded token matches the expected admin credentials
      if (token_decode !== expected) {
        return res.status(403).json({ 
          success: false, 
          message: "Admin access required" 
        });
      }

      next();
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid or expired token" 
      });
    }
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

export default adminAuth;
