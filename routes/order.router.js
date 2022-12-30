import { Router } from "express";
const router = Router();
import Order from "../models/order.model.js";
import authVerify from "../middlewares/auth-verify.middleware.js";
import Stripe from "stripe";
import Cart from "../models/cart.model.js";
const stripe = new Stripe(process.env.STRIPE_SECRET);

export const fulfillOrder = async (status, id) => {
  try {
    Order.findOneAndUpdate(
      { paymentId: id },
      { payment_status: status },
      { new: true },
      (error, data) => {
        if (error) {
          console.log(error.message);
          res.status(500).send({ message: error.message });
        } else {

          Cart.findOneAndUpdate(
            { userId: data.userId },
            { products: [] },
            { new: true },
            (error, data) => {
              if (error) {
                console.log(error.message);
                res.status(500).send({ message: error.message });
              } else {
                return data;
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error(error.message);
  }
};

router.route("/create-checkout-session").post(authVerify, async (req, res) => {
  try {
    const { user } = req;

    const orderItems = req.body.order.items.map((item) => {
      return {
        name: item.productId.name,
        unit_price: item.productId.price,
        quantity: item.quantity,
      };
    });

    const {
      order: { selectedAddress },
    } = req.body;

    const session = await stripe.checkout.sessions.create({
      line_items: req.body.order.items.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.productId.name,
            },
            unit_amount: item.productId.price * 100,
          },
          quantity: item.quantity,
        };
      }),

      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/declined",
    });

    let order = new Order({
      userId: user._id,
      paymentId: session.id,
      payment_status: session.status,
      total_paid: session.amount_total / 100,
      address: `${selectedAddress.flat}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode} `,
      items: orderItems,
    });

    // console.log(session.id);

    await order.save();
    // console.log(session, "session");
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
