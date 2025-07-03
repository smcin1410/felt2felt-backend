const express = require('express');
const router = express.Router();
const CityData = require('../models/CityData');

// @route   GET api/citydata/:city
// @desc    Get cost of living data for a specific city
// @access  Public
router.get('/:city', async (req, res) => {
  try {
    const cityData = await CityData.findOne({ city: req.params.city });
    
    if (!cityData) {
        // It's okay to not find data, it just means we haven't added it yet.
        // Send a 404 so the frontend knows it's not available.
        return res.status(404).json({ msg: 'No cost data found for this city.' });
    }

    res.json(cityData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
