// backend/routes/api.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Example protected route
router.get('/tasks', authController.protect, (req, res) => {
  res.json({ tasks: [] });
});

// Example public route
router.post('/login', authController.login);

module.exports = router;