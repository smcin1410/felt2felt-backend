const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import our auth middleware
const ItineraryItem = require('../models/Itinerary');
const User = require('../models/user');

// @route   GET api/itinerary
// @desc    Get all of a user's itinerary items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const items = await ItineraryItem.find({ user: req.user.id }).sort({ dateAdded: -1 });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/itinerary
// @desc    Add new itinerary item
// @access  Private
router.post('/', auth, async (req, res) => {
  const { itemType, name, location, city, dates, buyin } = req.body;

  try {
    const newItem = new ItineraryItem({
      user: req.user.id,
      itemType,
      name,
      location,
      city,
      dates,
      buyin
    });

    const item = await newItem.save();
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/itinerary/:id
// @desc    Delete an itinerary item
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let item = await ItineraryItem.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Make sure user owns the item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await ItineraryItem.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
