const express = require("express");
const userController = require("../Controllers/userController");
const authController = require("../Controllers/authController");
const detailValidation = require("../Middleware/detailValidation");
const upload = require("../Middleware/multerSetup");
const router = express.Router();

router.post(
  "/signup",
  upload.single("profileimg"),
  detailValidation,
  authController.signup
);
router.post("/login", authController.login);
router.route("/").get(authController.protect, userController.getAllUsers);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:id", authController.resetPassword);
router.post("/userMailQuery", authController.userMailQuery);

module.exports = router;