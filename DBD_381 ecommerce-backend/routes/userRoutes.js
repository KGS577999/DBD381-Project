// /routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const User = require('../models/User');

// GET all users (admin only)
router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE a user by ID (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE user role by ID (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;