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

const productSchema = new mongoose.Schema(
  {
    userId: {
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
      alt: String,
      required: true,
    },

    categoryName: {
      type: String,
      required: true,
    },

    productType: {
      type: String,
      required: true,
    },

    // colors: [],
    color: {
      type: String,
      required: true,
    },

    sizes: [
      {
        type: String,
      },
    ],

    inStock: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    reviews: [reviewSchema],

    price: {
      type: Number,
      required: true,
    },

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
