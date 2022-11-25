import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
app.use(json());
app.use(urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
const PORT = process.env.PORT || 5000;

// const { initialiseDBConnection } = require("./db/db.connect.js");

// initialiseDBConnection();

// const products = require("./routes/products.router");
// app.use("/products", products);

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
