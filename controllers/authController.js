import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //VERIFY USER INPUT
    if (!username || !email || !password) {
      return next(errorHandler(400, "Fill all fields"));
    }

    //HASH PASSWORD
    const hashedPassword = bcrypt.hashSync(password, 10);

    //CREATE AND SAVE NEW USER
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  //VERIFY USER INPUT
  const { email, password } = req.body;

  try {
    if (!email || !password) return next(errorHandler(404, "Fill all fields"));

    //VERIFY THAT USER EXISTS
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    //VERIFY PASSWORD
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    //generateToken(res, validUser._id);

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

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username
    res.json({ accessToken, username: validUser.username });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
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

      // Create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });

      // Send accessToken containing username
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

      // Create secure cookie with refresh token
      res.cookie("jwt", refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: "None", //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
      });

      // Send accessToken containing username
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
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = req.user.username;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

export const updateUsername = async (req, res, next) => {
  try {
    const { newUsername } = req.body;
    if (!newUsername)
      return res.status(200).json({ msg: "Please fill all fields" });

      console.log(req.user)

    const user = await User.findOne({ username: req.user.username });

    const alreadyExists = await User.findOne({username: newUsername})

    if(alreadyExists) return res.status(400).json({msg: "Username already taken"})

    user.username = newUsername

    await user.save();

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

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username
    res.json({ accessToken, username: user.username });

    res.status(200).json({ msg: "User details changed successfully" });
  } catch (err) {
    next(err);
  }
};