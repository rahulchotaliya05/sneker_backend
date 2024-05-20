const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema(
  {
    order: {
      type: Object,
      required: true,
    },
    razorpay_order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_signature: {
      type: String,
    },
    coustomerDetails: { type: Object, required: true },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    orderItems: { type: Object, required: true },
    orderStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const OrderModel = new mongoose.model("Order", OrderSchema);
module.exports = OrderModel;