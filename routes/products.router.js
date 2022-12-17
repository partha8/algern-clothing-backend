import { Router } from "express";
const router = Router();
import Product from "../models/product.model.js";
import pkg from "lodash";
const { extend } = pkg;

router.route("/").get(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to get products",
      errorMessage: err.message,
    });
  }
});

export default router;
