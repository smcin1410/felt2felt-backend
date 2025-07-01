const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Import all the models we need to manage
const Post = require('../models/Post');
const Destination = require('../models/Destination');
const Tournament = require('../models/Tournament');

// All routes in this file will first check for a valid login (auth), then for admin privileges (adminAuth).
const adminMiddleware = [auth, adminAuth];

// --- Post Management ---

// @route   DELETE api/admin/posts/:id
// @desc    Admin can delete any post
// @access  Private/Admin
router.delete('/posts/:id', adminMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post successfully deleted by admin.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- Destination Management ---

// @route   POST api/admin/destinations
// @desc    Admin can create a new destination
// @access  Private/Admin
router.post('/destinations', adminMiddleware, async (req, res) => {
    try {
        const newDestination = new Destination(req.body);
        const destination = await newDestination.save();
        res.json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/destinations/:id
// @desc    Admin can update a destination
// @access  Private/Admin
router.put('/destinations/:id', adminMiddleware, async (req, res) => {
    try {
        let destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ msg: 'Destination not found' });

        destination = await Destination.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/destinations/:id
// @desc    Admin can delete a destination
// @access  Private/Admin
router.delete('/destinations/:id', adminMiddleware, async (req, res) => {
    try {
        let destination = await Destination.findById(req.params.id);
        if (!destination) return res.status(404).json({ msg: 'Destination not found' });
        
        await Destination.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Destination removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- Tournament Management ---

// @route   POST api/admin/tournaments
// @desc    Admin can create a new tournament
// @access  Private/Admin
router.post('/tournaments', adminMiddleware, async (req, res) => {
    try {
        const newTournament = new Tournament(req.body);
        const tournament = await newTournament.save();
        res.json(tournament);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/admin/tournaments/:id
// @desc    Admin can update a tournament
// @access  Private/Admin
router.put('/tournaments/:id', adminMiddleware, async (req, res) => {
    try {
        let tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ msg: 'Tournament not found' });

        tournament = await Tournament.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(tournament);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/admin/tournaments/:id
// @desc    Admin can delete a tournament
// @access  Private/Admin
router.delete('/tournaments/:id', adminMiddleware, async (req, res) => {
    try {
        let tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ msg: 'Tournament not found' });

        await Tournament.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Tournament removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
