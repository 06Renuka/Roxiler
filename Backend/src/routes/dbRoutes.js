const express = require('express');
const router = express.Router();
const connectDB = require('../utils/db');

// Route to check and connect to the database
router.get('/connect', async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({ message: 'Database connected successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

module.exports = router;
