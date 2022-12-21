import mongoose from "mongoose";
const { Schema } = mongoose;

const categoriesSchema = new mongoose.Schema({
  categoryName: String,
});

const Categories = mongoose.model("Categories", categoriesSchema);

export default Categories;
