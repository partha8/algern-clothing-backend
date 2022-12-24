import { Router } from "express";
const router = Router();
import User from "../models/user.model.js";

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

router.route("/address").post(authVerify, async (req, res) => {
  try {
    const { user } = req;
    const body = req.body;

    const foundUser = await User.findById({ _id: user._id });

    if (body.action.type === "delete") {
      foundUser.addresses = foundUser.addresses.filter(
        (address) => address._id != body.address._id
      );
    } else if (body.action.type === "edit") {
      foundUser.addresses = foundUser.addresses.map((address) => {
        if (address._id == body.address._id) {
          return { ...body.address };
        }
        return address;
      });
    } else {
      foundUser.addresses.push(body.address);
    }

    let updatedUser = await foundUser.save();
    res
      .status(200)
      .json({ foundUser: updatedUser, encodedToken: user.encodedToken });
  } catch (error) {
    console.error(error);
    return res.status(error.status).send({ message: error.message });
  }
});

export default router;
