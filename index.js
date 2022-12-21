import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(json());
app.use(urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
const PORT = process.env.PORT || 5000;

import { initialiseDBConnection } from "./db/db.connect.js";

initialiseDBConnection();

import products from "./routes/products.router.js";
app.use("/products", products);

import auth from "./routes/auth.router.js";
app.use("/auth", auth);

import wishList from "./routes/wishlist.router.js";
app.use("/wishlist", wishList);

import cart from "./routes/cart.router.js";
app.use("/cart", cart);
app.get("/", (req, res) => {
  res.send("Hello Express app!");
});

import routeNotFoundHandler from "./middlewares/route-not-found.middlerware.js";
import allErrorsHandler from "./middlewares/all-errors-handler.middleware.js";

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
