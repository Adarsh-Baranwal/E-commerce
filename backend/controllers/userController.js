import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import bcryptjs from "bcryptjs";

//@desc   Authenticate a user and assign a jwt
//@route  POST api/users/login
//@access PUBLIC
export const authUsers = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password....");
  }
});

//@desc   Register a new user
//@route  POST api/users/
//@access PUBLIC
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201);
    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

//@desc   Get user profile
//@route  GET api/users/profile
//@access PRIVATE

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      isAdmin: user.isAdmin,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//@desc   UPDATE user profile
//@route  put api/users/profile
//@access PRIVATE

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//@desc   GET all user profile
//@route  put api/users/
//@access PRIVATE ADMIN ONLY

export const getAllUsers = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(400);
    throw new Error("You are not authorized");
  }
  const users = await User.find({}, { password: 0 });
  res.json(users);
});

//@desc   DELETE user profile
//@route  DELETE api/users/:id
//@access PRIVATE ADMIN ONLY

export const deleteUserById = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(400);
    throw new Error("You are not authorized");
  }
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    await user.remove();
    res.json({ message: "User Removed!!" });
  } else {
    res.status(404);
    throw new Error("User Not Found...");
  }
});

//@desc   Get user profile
//@route  GET api/users/:id
//@access PRIVATE ADMIN ONLY

export const getUserById = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(400);
    throw new Error("You are not authorized");
  }
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//@desc   UPDATE user profile ADMIN ONLY
//@route  put api/users/:id
//@access PRIVATE ADMIN ONLY

export const updateUserProfileById = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(401);
    throw new Error("You are not authorized");
  }
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
