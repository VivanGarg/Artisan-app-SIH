const express = require("express");
const Order = require("../models/order");
const { isConnected } = require("../config/db");

const router = express.Router();

// Runtime in-memory orders store
const localOrders = new Map();

// Helper to generate tracking consignment
const generateConsignmentId = () => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `KS-${num}`;
};

// Initial sample order matching Stitch screen
const sampleOrder = {
  id: "ord-sample-1",
  orderNumber: "ORD-98241",
  trackingNumber: "KS-98241",
  items: [
    {
      productId: "prod-1",
      title: "Pure Katan Silk Chanderi Saree",
      price: 7850,
      artisanWage: 6400,
      artisanName: "Smt. Yashoda Bai (MP)",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBPY7EbJCXidlF6lx6HV-VpQZBfi3UrBiCVxciTPfXYuJxHS1LsdC4DuK2fm6Auj-JUZcP-BiTArfk75pt78-THQNztLr5JS143pOdVGS8g1W4dj8QmfdqpdS-l-TO4C1bMndQlw0sepSGxP8NNogQxD1MQH5fWHewBJwIKC-5pjhj6xZpVMYrhwtA--eiCRCMMrYuivANNGYzuns1N7HZhzHkYiK1GfddD3fZKML2mcZk6-Cak1eX",
      quantity: 1
    },
    {
      productId: "prod-2",
      title: "Dokra Bell Metal Sacred Nandi",
      price: 2890,
      artisanWage: 2350,
      artisanName: "Shri Budhram Kashyap (Bastar)",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPWcYRuuACjAdse5B084ZirHZxsHD5G2cGLV4atMFpoGFpZEfvDtZ_PPDb4vOw69xJJZ4y225dk08VfDbHP_-9RW12trE7XFQB87H_SoZ1MTlXroIV6RmOTYoILfVvBkQQJNI50VvArAz0rdvY7DxwFwFVViSH1Dn-URtU9J9UIoNuWVj_sV0LKIZXGuwi8BxedbFnUbqJF2zCnt3uGNKh1aoETZoxAXjiuWUCaOIJSQxNqlpwWaer",
      quantity: 1
    }
  ],
  shippingAddress: {
    fullName: "Pooja Sharma",
    phone: "+91 98450 12890",
    pincode: "560001",
    street: "Flat 402, Kaveri Heritage Enclave, 14th Main, Near Cubbon Park",
    city: "Bengaluru Urban",
    state: "Karnataka"
  },
  deliveryPlan: "standard",
  shippingFee: 0,
  subtotal: 10740,
  totalAmount: 10740,
  artisanEscrowAmount: 8750,
  paymentMethod: "upi",
  status: "in_transit",
  milestones: [
    { name: "Ordered", description: "Escrow locked", completed: true, active: false, time: "Yesterday, 10:30 AM" },
    { name: "Loom Finished", description: "Weaver complete", completed: true, active: false, time: "Yesterday, 04:15 PM" },
    { name: "Inspected", description: "GI tag & Silk Mark", completed: true, active: false, time: "Today, 09:00 AM" },
    { name: "In Transit", description: "India Post Depot", completed: false, active: true, time: "Out for transit" },
    { name: "Delivered", description: "Doorstep verification", completed: false, active: false, time: "Expected in 48h" }
  ],
  createdAt: new Date().toISOString()
};
localOrders.set("KS-98241", sampleOrder);
localOrders.set("ord-sample-1", sampleOrder);

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { items, shippingAddress, deliveryPlan, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const artisanEscrowAmount = items.reduce(
      (sum, item) => sum + ((item.artisanWage || Math.round(item.price * 0.85)) * (item.quantity || 1)),
      0
    );
    const shippingFee = deliveryPlan === "express" ? 180 : 0;
    const totalAmount = subtotal + shippingFee;

    const trackingNumber = generateConsignmentId();
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingNumber,
      items,
      shippingAddress: shippingAddress || {
        pincode: "560001",
        city: "Bengaluru Urban",
        state: "Karnataka",
        street: "Kaveri Enclave",
        phone: "+91 98450 12890"
      },
      deliveryPlan: deliveryPlan || "standard",
      shippingFee,
      subtotal,
      totalAmount,
      artisanEscrowAmount,
      paymentMethod: paymentMethod || "upi",
      status: "escrow_locked",
      milestones: [
        { name: "Ordered", description: "Artisan escrow locked", completed: true, active: false, time: "Just now" },
        { name: "Loom Finished", description: "Master artisan completing finish", completed: false, active: true, time: "In progress" },
        { name: "Inspected", description: "GI cluster seal & quality tag", completed: false, active: false, time: "Pending" },
        { name: "In Transit", description: "India Post Rural Logistics", completed: false, active: false, time: "Pending" },
        { name: "Delivered", description: "Escrow release on verification", completed: false, active: false, time: "Pending" }
      ],
      createdAt: new Date().toISOString()
    };

    localOrders.set(trackingNumber, newOrder);
    localOrders.set(newOrder.id, newOrder);

    if (isConnected()) {
      try {
        await Order.create(newOrder);
      } catch (e) {
        console.warn("MongoDB order save notice:", e.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Order placed and artisan escrow locked successfully",
      data: newOrder
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// GET /api/orders/:id (Search by trackingNumber or orderId)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let order = localOrders.get(id);

  if (!order && isConnected()) {
    try {
      order = await Order.findOne({ $or: [{ orderNumber: id }, { trackingNumber: id }] });
    } catch (e) {
      order = null;
    }
  }

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  res.json({ success: true, data: order });
});

module.exports = router;
