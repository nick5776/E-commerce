const { Router } = require("express");
const testController = require("../controllers/testController");

const router = Router();

router.get("/test", testController)

module.exports = router;