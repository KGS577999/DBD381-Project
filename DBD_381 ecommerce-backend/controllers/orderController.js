// /controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const { orderItems, userId, ...rest } = req.body;
        let total = 0;

        // Calculate total & update stock
        for (const item of orderItems) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
            if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });

            item.price = product.price;
            item.total = product.price * item.quantity;
            total += item.total;

            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            userId,
            orderItems,
            total,
            ...rest
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('orderItems.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId').populate('orderItems.productId');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = req.body.status;
        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
