const productModel = require("../models/productModel");
const cloudinary = require('../config/cloudinary');

const getAllProductsController = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    const products = await productModel
      .find({
        name: {
          $regex: keyword ? keyword : "",
          $options: "i", //will act as case insensitive
        },
      })
      .populate("category");
    //const products = await productModel.find({}); ye toh simply sare products find kr rha tha
    res.status(200).send({
      success: true,
      message: "all products fetched successfully",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get All Products API",
      error,
    });
  }
};

export const getTopProductsController = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).send({
      success: true,
      message: "top 3 products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get TOP PRODUCTS API",
      error,
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    // get product id
    const product = await productModel.findById(req.params.id);
    //valdiation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product Found",
      product,
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Get single Products API",
      error,
    });
  }
};

const createProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Cloudinary gives you .path (url) and .filename (public_id)
    const imageArray = req.files.map(file => ({
      public_id: file.filename,     // Cloudinary public_id
      url: file.path,               // Secure URL from Cloudinary
    }));

    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      images: imageArray,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: err.message,
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    //valdiatiuon
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    const { name, description, price, stock, category } = req.body;
    // validate and update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.status(200).send({
      success: true,
      message: "product details updated",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};

const addImagesToProductController = async (req, res) => {
  try {
    const productId = req.params.id;

    // 1. Find the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2. Map new uploaded images
    const newImages = req.files.map(file => ({
      public_id: file.public_id,
      url: file.path,
    }));

    // 3. Append new images
    product.images.push(...newImages);

    // 4. Save updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Images added successfully",
      images: product.images,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to add images",
      error: err.message,
    });
  }
};

const deleteProductImageController = async (req, res) => {
  try {
    const { productId, publicId } = req.params;

    // 1. Find the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2. Check if the image exists
    const imageToDelete = product.images.find(img => img.public_id === publicId);
    if (!imageToDelete) {
      return res.status(404).json({ success: false, message: "Image not found in product" });
    }

    // 3. Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // 4. Remove image from MongoDB array
    product.images = product.images.filter(img => img.public_id !== publicId);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      images: product.images,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const productId = req.params.productId;

    // 1. Find product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // 2. Delete each image from Cloudinary
    for (const img of product.images) {
      //console.log(img.public_id + " ");
      await cloudinary.uploader.destroy(img.public_id);
    }

    // 3. Delete the product from the database
    await productModel.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      message: "Product and all images deleted successfully",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    // find product
    const product = await productModel.findById(req.params.id);
    // check previous review (basically same bnde ko 2 bar review + rating dena same product pe allowed nhi h)
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).send({
        success: false,
        message: "Product Already Reviewed",
      });
    }
    // review object
    const review = {
      name: req.user.name, //token se aarha jse _id ati h, json se m sirf comment and rating bhejra hu
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    // passing review object to reviews array
    product.reviews.push(review);
    // number of reviews
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length; 
    /*
product.reviews = [
  { rating: 4 },
  { rating: 5 },
  { rating: 3 },
];
Step 1: acc = 0, curr = {rating: 4} → result = 0 + 4 = 4
Step 2: acc = 4, curr = {rating: 5} → result = 4 + 5 = 9
Step 3: acc = 9, curr = {rating: 3} → result = 9 + 3 = 12
    */
    // save
    await product.save();
    res.status(200).send({
      success: true,
      message: "Review Added!",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Review Comment API",
      error,
    });
  }
};

module.exports = {
    getAllProductsController,
    getSingleProductController,
    createProductController,
    updateProductController,
    addImagesToProductController,
    deleteProductImageController,
    deleteProductController,
    productReviewController,
    getTopProductsController
}