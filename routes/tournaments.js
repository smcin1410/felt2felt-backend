const express = require('express');
const router = express.Router();
const TournamentSeries = require('../models/Tournament');

// @route   GET api/tournaments
// @desc    Get all tournament series
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Sorting by start date to show upcoming events first
    const tournaments = await TournamentSeries.find().sort({ startDate: 1 });
    res.json(tournaments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
