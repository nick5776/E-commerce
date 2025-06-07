const express = require("express");
const mongoose = require("mongoose");
const { checkForAuthentication, isAdmin } = require("../middlewares/authentication");
const {createCategory, getAllCategoriesController, deleteCategoryController, updateCategoryController } = require("../controllers/categoryController");

const { Router } = require("express");

const router = Router();

router.post("/create", checkForAuthentication,isAdmin,createCategory);

router.get("/get-all", checkForAuthentication, getAllCategoriesController);

router.delete("/delete/:id", checkForAuthentication, isAdmin, deleteCategoryController);

router.put("/update/:id", checkForAuthentication, isAdmin, updateCategoryController);

module.exports = router;