import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const colorSchema = new mongoose.Schema({
  color: {
    type: String,
  },
});

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
  },
});

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },

    marker: {
      type: String,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    productType: {
      type: String,
      required: true,
    },

    colors: [colorSchema],
    sizes: [sizeSchema],

    inStock: {
      type: Boolean,
      default: true,
    },

    reviews: [reviewSchema],

    offer: {
      type: Number,
      default: 0,
    },

    avalQty: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
