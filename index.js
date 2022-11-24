const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());
const PORT = 3000;

// const { initialiseDBConnection } = require("./db/db.connect.js");

// initialiseDBConnection();

// const products = require("./routes/products.router");
// app.use("/products", products);

app.get("/", (req, res) => {
  res.send("Hello Express app!");
});

const routeNotFoundHandler = require("./middlewares/route-not-found.middlerware");
const allErrorsHandler = require("./middlewares/all-errors-handler.middleware");

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
