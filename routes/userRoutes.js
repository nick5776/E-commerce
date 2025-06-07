const express = require("express");
const mongoose = require("mongoose");

const { Router } = require("express");
const { registerController, loginController, getUserProfileController, logoutController, updateProfileController, updatePasswordController,
    uploadProfilePicture, passwordResetController
 } = require("../controllers/userController");
const { checkForAuthentication } = require("../middlewares/authentication");
const upload = require("../middlewares/multer");

const router = Router();

router.post("/register",registerController); //signup

router.post("/login",loginController) //signin

router.get("/profile", checkForAuthentication, getUserProfileController); //private route

router.get("/logout", checkForAuthentication, logoutController);

router.put("/profile-update", checkForAuthentication, updateProfileController);

router.put("/password-update", checkForAuthentication, updatePasswordController);

router.post("/profile-upload" , checkForAuthentication, upload.single("image"), uploadProfilePicture);

router.post("/reset-password", checkForAuthentication, passwordResetController);

module.exports = router;

