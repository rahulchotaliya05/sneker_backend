const express = require("express");
const paymentController = require("../Controllers/paymentController");

const router = express.Router();

router.post("/checkout", paymentController.checkout);
router.post("/verification", paymentController.paymentVerification);
router.get("/getuserorder/:id?", paymentController.getUserOrder);
router.get("/getsellerorder/:id?", paymentController.getSellerOrder);
router.route("/:id?").patch(paymentController.updateOrderById);
module.exports = router;