import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: String,
    payment_status: String,
    address: {
      type: String,
      required: true,
    },
    total_paid: Number,
    items: [
      {
        name: String,
        unit_price: Number,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);
export default Order;
