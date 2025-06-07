const express = require("express");
const mongoose = require("mongoose");
const upload = require("../middlewares/multer");
const { checkForAuthentication, isAdmin } = require("../middlewares/authentication");
const {createOrderController, getMyOrdersCotroller, singleOrderDetailsController,
    paymentsController, getAllOrdersController, changeOrderStatusController
} = require("../controllers/orderController");
const { Router } = require("express");


const router = Router();

router.post("/create", checkForAuthentication, createOrderController);

router.get("/my-order", checkForAuthentication, getMyOrdersCotroller);

router.get("/my-order/:id", checkForAuthentication, singleOrderDetailsController);

router.post("/payment", checkForAuthentication, paymentsController);

router.get("/admin/all-order", checkForAuthentication, isAdmin, getAllOrdersController);

router.put("/admin/order/:id", checkForAuthentication, isAdmin, changeOrderStatusController) //change order status
module.exports = router;