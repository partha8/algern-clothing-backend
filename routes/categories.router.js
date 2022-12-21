import { Router } from "express";
const router = Router();
import pkg from "lodash";
const { extend } = pkg;
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import Categories from "../models/categories.model.js";

dotenv.config();

router.route("/").get(async (req, res) => {
  try {
    const categories = await Categories.find({});
    res.json({ categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "unable to get products",
      errorMessage: err.message,
    });
  }
});

export default router;
