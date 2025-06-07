const mongoose = require("mongoose");

// REVIEW MODEL
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is require"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user require"],
    },
  },
  { timestamps: true }
);

// PROCUCT MODEL
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
    description: {
      type: String,
      required: [true, "produvct description is required"],
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
    },
    stock: {
      type: Number,
      required: [true, "product stock required"],
    },
    // quantity: {
    //   type: Number,
    //   required: [true, "product quantity required"],
    // },
    category: {
      type: mongoose.Schema.Types.ObjectId, // the field will store the _id of another model
      ref: "Category", //ref acts like a foreign key -> allows to build relationship b/w 2 schemas(table)
    },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
    reviews: [reviewSchema],
    rating: { //avg rating on the basis of all reviews ratings
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/*
Product 
{
  "_id": "123",
  "name": "iPhone 15",
  .....
  "category": "65f123abc4567890def45678"
}
Category
{
  "_id": "65f123abc4567890def45678",
  "type": "Smartphones"
}
*/
const productModel = mongoose.model("Products", productSchema);
module.exports = productModel;