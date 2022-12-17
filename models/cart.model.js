import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      active: Boolean,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
