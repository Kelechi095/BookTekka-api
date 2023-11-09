import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const authenticateUser = async(req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        req.user = await User.findOne({username: decoded.username})

        if (!req.user) return res.status(401).json({ message: "Unauthorized" });
        next()
      }
    );
  } catch (err) {
    next(err);
  }
}