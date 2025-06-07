const express = require("express");
const mongoose = require("mongoose");
const upload = require("../middlewares/multer");
const { checkForAuthentication, isAdmin } = require("../middlewares/authentication");

const { Router } = require("express");
const {getAllProductsController, getSingleProductController, createProductController, updateProductController,
    addImagesToProductController ,deleteProductImageController, deleteProductController, productReviewController, getTopProductsController
} = require("../controllers/productController");

const router = Router();

router.get("/get-all", getAllProductsController);

router.get("/top", getTopProductsController);

router.get("/:id", getSingleProductController);

router.post("/create" , checkForAuthentication, isAdmin, upload.array("images", 5), createProductController);

router.put("/:id", checkForAuthentication, isAdmin, updateProductController); // product ko update krne ke liye

router.put("/:id/add-images", checkForAuthentication, upload.array("images", 5), addImagesToProductController); //product m aur image add krne ke liye

router.delete("/:productId/image/:publicId",checkForAuthentication,isAdmin,deleteProductImageController); // to delete image from product

router.delete("/:productId", checkForAuthentication, isAdmin, deleteProductController); // delete entire product

router.put("/:id/reviews", checkForAuthentication, productReviewController);

module.exports = router;