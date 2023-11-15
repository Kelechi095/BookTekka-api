import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(errorHandler(400, "Fill all fields"));
    }

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists)
      return res.status(400).json({ msg: "Email already used" });

    const isUsernameExists = await User.findOne({ username });

    if (isUsernameExists)
      return res.status(400).json({ msg: "Username already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return next(errorHandler(404, "Fill all fields"));

    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: validUser.username,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { username: validUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, username: validUser.username });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    console.log(req);
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await User.findOne({
          username: decoded.username,
        }).exec();

        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken, username: foundUser.username });
      }
    );
  } catch (err) {
    next(err);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  const { email, name, photo } = req.body;

  if (!email || !name || !photo)
    return res.status(400).json({ msg: "Please fill all fields" });
  try {
    const user = await User.findOne({ email });

    if (user) {
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken, username: user.username });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 1000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: newUser.username,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5m" }
      );

      const refreshToken = jwt.sign(
        { username: newUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken, username: newUser.username });
    }
  } catch (error) {
    next(error);
  }
};

export const setUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { newUsername, file } = req.body;
    const user = await User.findOne({ username: req.user.username });

    const alreadyExists = await User.findOne({ username: newUsername });

    if (alreadyExists && req.user.username !== newUsername) {
      return res.status(400).json({ msg: "Username already taken" });
    }

    if (!file) {
      user.username = newUsername;
      await user.save();
    } else {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const uploadRes = await cloudinary.uploader.upload(file, {
        upload_preset: "mernAuth",
      });

      if (!uploadRes)
        return res.status(400).json({ msg: "error uploading photo" });

      user.username = newUsername;
      user.profilePicture = uploadRes.url;

      await user.save();
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user.username,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //res.json({ accessToken, username: user.username });

    res.status(200).json({ msg: "User details changed successfully" });
  } catch (err) {
    next(err);
  }
};

