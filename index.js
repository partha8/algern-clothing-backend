import express, { json, urlencoded } from "express";
import cors from "cors";
import dotenv from "dotenv";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET);

import { fulfillOrder } from "./routes/order.router.js";

dotenv.config();

const app = express();
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// app.use(json());
app.use(urlencoded({ extended: true })); // support encoded bodies

app.use(cors());

const PORT = process.env.PORT || 5000;

import { initialiseDBConnection } from "./db/db.connect.js";

initialiseDBConnection();

import products from "./routes/products.router.js";
app.use("/products", products);

import categories from "./routes/categories.router.js";
app.use("/categories", categories);

import auth from "./routes/auth.router.js";
app.use("/auth", auth);

import wishList from "./routes/wishlist.router.js";
app.use("/wishlist", wishList);

import user from "./routes/user.router.js";
app.use("/user", user);

import cart from "./routes/cart.router.js";
app.use("/cart", cart);

import order from "./routes/order.router.js";
app.use("/order", order);

app.get("/", (req, res) => {
  res.send("Hello Express app!");
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    let event = request.body;
    let endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.payment_status === "paid") {
          fulfillOrder(session.payment_status, session.id);
        }

        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        // Fulfill the purchase...
        fulfillOrder(session.payment_status);
        break;
      }
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        break;
      case "payment_method.attached":
        const paymentMethod = event.data.object;
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    response.send();
  }
);

import routeNotFoundHandler from "./middlewares/route-not-found.middlerware.js";
import allErrorsHandler from "./middlewares/all-errors-handler.middleware.js";
import authVerify from "./middlewares/auth-verify.middleware.js";

/**
 * 404 Route Handler
 * Note: Do Not Move. This should be the last route.
 */
app.use(routeNotFoundHandler);

/**
 * Error Handler
 * Note: Do Not Move.
 */
app.use(allErrorsHandler);

app.listen(PORT, () => {
  console.log("server started on port: ", PORT);
});
