const express = require('express');
const router = express.Router();
// Use the unified Location model as the single source of truth
const Location = require('../models/Location');

/**
 * @route   GET api/destinations
 * @desc    Get all poker locations using the unified Location model
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Fetch all documents from the 'locations' collection
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;