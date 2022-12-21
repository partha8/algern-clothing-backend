import { Router } from "express";
const router = Router();
import pkg from "lodash";
const { extend } = pkg;
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

router.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(404).send({ message: "user not found" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const encodedToken = jwt.sign(
        { _id: foundUser._id, email },
        process.env.SECRET,
      );
      return res.status(200).json({ foundUser, encodedToken });
    } else {
      return res.status(401).send({ message: "Password invalid" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong..." });
  }
});

router.route("/signup").post(async (req, res) => {
  try {
    const user = req.body;

    const userExists = await User.findOne({ email: user.email });

    if (userExists) {
      return res.status(422).send({ message: "Email already exists" });
    }

    const encryptedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({
      firstName: user.firstName,
      lastName: user.lastName,
      password: encryptedPassword,
      email: user.email,
      addresses: [],
    });

    const createdUser = await newUser.save();

    const encodedToken = jwt.sign(
      {
        _id: createdUser._id,
        email: createdUser.email,
      },
      process.env.SECRET
    );
    return res.status(201).json({ createdUser, encodedToken });
  } catch (error) {
    return res.status(500).send({ message: "Something went wrong..." });
  }
});

export default router;
