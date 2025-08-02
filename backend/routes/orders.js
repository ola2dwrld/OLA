const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      paymentMethod,
      deliveryMethod = 'standard',
      notes
    } = req.body;

    // Validate products and calculate total
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.images[0] || ''
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Calculate shipping and final amount
    const shippingCost = deliveryMethod === 'express' ? 2000 : 1000; // Nigerian Naira
    const tax = totalAmount * 0.075; // 7.5% VAT
    const finalAmount = totalAmount + shippingCost + tax;

    // Calculate estimated delivery
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + (deliveryMethod === 'express' ? 2 : 5));

    const order = new Order({
      user: req.user._id,
      products: orderProducts,
      totalAmount,
      shippingCost,
      tax,
      finalAmount,
      shippingAddress,
      paymentMethod,
      deliveryMethod,
      estimatedDelivery,
      notes,
      orderHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order created'
      }]
    });

    await order.save();
    await order.populate('user', 'name email phone');

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('products.product', 'name images');

    const total = await Order.countDocuments({ user: req.user._id });

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('products.product', 'name images description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    order.orderHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    // Set delivery date if status is delivered
    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status
router.patch('/:id/payment', auth, async (req, res) => {
  try {
    const { paymentStatus, paymentReference } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.paymentStatus = paymentStatus;
    if (paymentReference) {
      order.paymentReference = paymentReference;
    }

    order.orderHistory.push({
      status: order.orderStatus,
      timestamp: new Date(),
      note: `Payment status updated to ${paymentStatus}`
    });

    // If payment is successful, update order status
    if (paymentStatus === 'paid' && order.orderStatus === 'pending') {
      order.orderStatus = 'confirmed';
      order.orderHistory.push({
        status: 'confirmed',
        timestamp: new Date(),
        note: 'Order confirmed after successful payment'
      });
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      startDate,
      endDate
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) {
      filter.orderStatus = status;
    }
    
    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email phone')
      .populate('products.product', 'name images');

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel order
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel order in current status' });
    }

    order.orderStatus = 'cancelled';
    order.orderHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Order cancelled by customer'
    });

    // Restore product stock
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;