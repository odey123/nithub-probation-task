const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Order Model
const Order = mongoose.model("Order", new mongoose.Schema({
  userId: String,
  productId: String,
  quantity: Number,
  totalPrice: Number,
  status: { type: String, default: "pending" }
}));

// Get all orders
router.get("/", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Get an order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create an order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// Update order status
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
