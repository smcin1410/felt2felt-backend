const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// --- New Imports for CSV Upload ---
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');

// Import all the models we need to manage
const Post = require('../models/Post');
const Destination = require('../models/Destination');
const Tournament = require('../models/Tournament');
// Note: The new route will import into the 'Tournament' model by default.
// You can change this to any other model as needed.

// All routes in this file will first check for a valid login (auth), then for admin privileges (adminAuth).
const adminMiddleware = [auth, adminAuth];

// --- Multer Configuration for File Upload ---
// Configures Multer to store the uploaded CSV file in memory as a buffer.
// This is efficient as it avoids writing to the server's disk.
const upload = multer({ storage: multer.memoryStorage() });


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


// --- NEW: Bulk Data Import ---

// @route   POST api/admin/upload-csv
// @desc    Admin can upload a CSV file to bulk-import data
// @access  Private/Admin
router.post('/upload-csv', [...adminMiddleware, upload.single('csvFile')], (req, res) => {
    
    // Check if a file was even uploaded by multer
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded. Please select a CSV file.' });
    }

    const results = [];
    // Create a readable stream directly from the file buffer held in memory
    const readableFileStream = Readable.from(req.file.buffer);

    readableFileStream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Basic validation: ensure the CSV was not empty
                if (results.length === 0) {
                    return res.status(400).json({ msg: 'CSV file is empty or could not be parsed.' });
                }
                
                // --- Data Validation and Transformation (Optional but Recommended) ---
                // Before inserting, you might want to validate or clean the data.
                // For example, ensuring required fields exist or converting data types.
                // Example:
                // const validatedResults = results.filter(row => row.name && row.date);
                // if(validatedResults.length !== results.length) {
                //    return res.status(400).json({ msg: 'Some rows were missing required data.' });
                // }

                // --- Database Insertion ---
                // IMPORTANT: Replace 'Tournament' with the actual Mongoose model you want to import data into.
                await Tournament.insertMany(results); 
                
                // Send a success response
                res.status(200).json({
                    msg: `Successfully imported ${results.length} records.`
                });

            } catch (err) {
                // Handle potential errors during the database operation
                console.error('Error during database import:', err.message);
                res.status(500).json({ msg: 'An error occurred while importing data into the database.' });
            }
        })
        .on('error', (err) => {
            // Handle errors that occur during the file stream/parsing process
            console.error('Error processing CSV stream:', err.message);
            res.status(500).json({ msg: 'Error processing the CSV file.' });
        });
});


module.exports = router;
