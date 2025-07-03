const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');

// @route   GET api/destinations
// @desc    Get all destinations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
