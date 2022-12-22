import { Router } from "express";
const router = Router();
import pkg from "lodash";
const { extend } = pkg;
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import authVerify from "../middlewares/auth-verify.middleware.js";

dotenv.config();

router.route("/").get(authVerify, async (req, res) => {
  try {
    const { user } = req;
    const foundUser = await User.findById({ _id: user._id });
    res.status(200).json({ foundUser, encodedToken: user.encodedToken });
  } catch (error) {
    console.error(error);
    return res.status(error.status).send({ message: error.message });
  }
});

export default router;
