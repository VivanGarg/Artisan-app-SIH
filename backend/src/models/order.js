const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    trackingNumber: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        artisanWage: { type: Number },
        artisanName: { type: String },
        image: { type: String },
        quantity: { type: Number, default: 1 }
      }
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      pincode: String,
      street: String,
      city: String,
      state: String
    },
    deliveryPlan: { type: String, enum: ["standard", "express"], default: "standard" },
    shippingFee: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    artisanEscrowAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["upi", "ondc", "card"], default: "upi" },
    status: {
      type: String,
      enum: ["escrow_locked", "loom_finished", "inspected", "in_transit", "delivered"],
      default: "escrow_locked"
    },
    milestones: [
      {
        name: String,
        description: String,
        timestamp: { type: Date, default: Date.now },
        completed: Boolean,
        active: Boolean
      }
    ]
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
