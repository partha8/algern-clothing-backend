import { Router } from "express";
const router = Router();
import pkg from "lodash";
const { extend } = pkg;

import dotenv from "dotenv";

dotenv.config();

import authVerify from "../middlewares/auth-verify.middleware.js";
import Cart from "../models/cart.model.js";

router.route("/").get(authVerify, async (req, res) => {
  try {
    const { user } = req;
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      cart = new Cart({ userId: user._id, products: [] });
      cart = await cart.save();
    }
    cart = await cart.populate({
      path: "products.productId",
    });

    res.status(200).json({ cart });
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
    const body = req.body;

    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      cart = new Cart({ userId: user._id, products: [] });
      cart = await cart.save();
    }

    let removeItem = false;

    if (body.action) {
      if (body.action.type === "increment") {
        cart.products = cart.products.map((product) => {
          if (product.productId) {
            product.quantity = product.quantity + 1;
            return product;
          }
          return product;
        });
      }
      if (body.action.type === "decrement") {
        cart.products = cart.products.map((product) => {
          if (product.productId) {
            if (product.quantity == 1) {
              removeItem = true;
              return product;
            }
            product.quantity = product.quantity - 1;

            return product;
          }
          return product;
        });
      }
    }

    const isProductAlreadyAdded = cart.products.find(
      (product) => product.productId == body._id
    );

    if (
      (isProductAlreadyAdded && !body.action) ||
      (isProductAlreadyAdded && body.action.type == "decrement" && removeItem)
    ) {
      console.log("inside if, cart route");

      cart.products = cart.products.filter(
        (product) => product.productId != body._id
      );
      removeItem = false;
    }
    if (!isProductAlreadyAdded && !body.action) {
      cart.products.push({ productId: body._id, quantity: 1 });
    }

    let updatedCartFromDB = await cart.save();
    updatedCartFromDB = await updatedCartFromDB.populate({
      path: "products.productId",
    });

    res.status(200).json({ cart: updatedCartFromDB });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Request failed please check errorMessage key for more details",
      errorMessage: error.message,
    });
  }
});

export default router;
