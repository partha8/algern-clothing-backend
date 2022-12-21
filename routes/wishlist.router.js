import { Router } from "express";
const router = Router();
import pkg from "lodash";
import dotenv from "dotenv";

dotenv.config();

import authVerify from "../middlewares/auth-verify.middleware.js";
import Wishlist from "../models/wishlist.model.js";

router.route("/").get(authVerify, async (req, res) => {
  try {
    const { user } = req;
    let wishList = await Wishlist.findOne({ userId: user._id });
    if (!wishList) {
      wishList = new Wishlist({ userId: user._id, products: [] });
      wishList = await wishList.save();
    }
    wishList = await wishList.populate({
      // path: "products.productId",
      path: "products",
    });

    res.status(200).json({ wishlist: wishList.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
});

router.route("/").post(authVerify, async (req, res) => {
  try {
    const { user } = req;
    const productUpdate = req.body;

    let wishList = await Wishlist.findOne({ userId: user._id });

    if (!wishList) {
      wishList = new Wishlist({ userId: user._id, products: [] });
      wishList = await wishList.save();
    }

    const isProductAlreadyAdded = wishList.products.find(
      (product) => product == productUpdate._id
    );


    if (isProductAlreadyAdded) {

      wishList.products = wishList.products.filter(
        (product) => product != productUpdate._id
      );
    } else {
      wishList.products.push(productUpdate._id);
    }

    let updatedWishlistFromDB = await wishList.save();
    updatedWishlistFromDB = await updatedWishlistFromDB.populate({
      path: "products",
    });

    res.status(200).json({ wishlist: updatedWishlistFromDB.products });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
});

export default router;
