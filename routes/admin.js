const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Tournament = require('../models/Tournament');
const Location = require('../models/Location');
const { check, validationResult } = require('express-validator');
const axios = require('axios'); // Using axios to make the call to the geocoding API

// --- Tournament Management Routes ---

// @route   POST /api/admin/tournaments
// @desc    Create a new tournament series
// @access  Private (Admin)
router.post(
    '/tournaments',
    [auth, adminAuth], // Middleware to ensure user is logged in and is an admin
    [
        // Validation checks for required fields
        check('seriesName', 'Series name is required').not().isEmpty(),
        check('city', 'City is required').not().isEmpty(),
        check('region', 'Region/State is required').not().isEmpty(),
        check('country', 'Country is required').not().isEmpty(),
        check('startDate', 'Start date is required').isISO8601().toDate(),
        check('endDate', 'End date is required').isISO8601().toDate(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newTournament = new Tournament(req.body);
            const tournament = await newTournament.save();
            res.json(tournament);
        } catch (err) {
            console.error(err.message);
            if (err.code === 11000) { // Handle duplicate series name error
                return res.status(400).json({ msg: 'A tournament with this series name already exists.' });
            }
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT /api/admin/tournaments/:id
// @desc    Update an existing tournament series
// @access  Private (Admin)
router.put('/tournaments/:id', [auth, adminAuth], async (req, res) => {
    try {
        let tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ msg: 'Tournament not found' });

        tournament = await Tournament.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Returns the document after update
        );

        res.json(tournament);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/admin/tournaments/:id
// @desc    Delete a tournament series
// @access  Private (Admin)
router.delete('/tournaments/:id', [auth, adminAuth], async (req, res) => {
    try {
        let tournament = await Tournament.findById(req.params.id);
        if (!tournament) return res.status(404).json({ msg: 'Tournament not found' });

        await Tournament.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Tournament removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// --- Location Management Routes ---

// @route   POST /api/admin/locations
// @desc    Create a new location
// @access  Private (Admin)
router.post(
    '/locations',
    [auth, adminAuth],
    [
        check('name', 'Location name is required').not().isEmpty(),
        check('address', 'Address is required').not().isEmpty(),
        check('city', 'City is required').not().isEmpty(),
        check('region', 'Region/State is required').not().isEmpty(),
        check('country', 'Country is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, address, city, region, country, atmosphere, primaryPlayerType, businessModel, businessModelNotes, details } = req.body;

        try {
            // --- SERVER-SIDE GEOCODING LOGIC ---
            // This block calls a third-party API (Mapbox) to get coordinates from the address.
            // IMPORTANT: You must have a MAPBOX_API_KEY in your .env file for this to work.
            const mapboxApiKey = process.env.MAPBOX_API_KEY;
            const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)},${encodeURIComponent(city)},${encodeURIComponent(region)}.json?access_token=${mapboxApiKey}&limit=1`;
            
            let geolocation = {};
            if (mapboxApiKey) {
                const geoRes = await axios.get(geocodeUrl);
                if (geoRes.data && geoRes.data.features && geoRes.data.features.length > 0) {
                    const [longitude, latitude] = geoRes.data.features[0].center;
                    geolocation = {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    };
                }
            }
            // --- END GEOCODING LOGIC ---

            const newLocation = new Location({
                name,
                address,
                city,
                region,
                country,
                geolocation, // Add the generated geolocation data
                atmosphere,
                primaryPlayerType,
                businessModel,
                businessModelNotes,
                details
            });

            const location = await newLocation.save();
            res.json(location);

        } catch (err) {
            console.error(err.message);
            if (err.code === 11000) {
                return res.status(400).json({ msg: 'A location with this name already exists.' });
            }
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT /api/admin/locations/:id
// @desc    Update an existing location
// @access  Private (Admin)
router.put('/locations/:id', [auth, adminAuth], async (req, res) => {
    const { address, city, region } = req.body;
    try {
        let location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ msg: 'Location not found' });

        // Check if the address has changed to re-run geocoding
        const fullAddress = `${address},${city},${region}`;
        const oldAddress = `${location.address},${location.city},${location.region}`;
        
        let updatedFields = { ...req.body };

        if (fullAddress !== oldAddress) {
            // --- RE-RUN GEOCODING LOGIC ON UPDATE ---
            const mapboxApiKey = process.env.MAPBOX_API_KEY;
             if (mapboxApiKey) {
                const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)},${encodeURIComponent(city)},${encodeURIComponent(region)}.json?access_token=${mapboxApiKey}&limit=1`;
                const geoRes = await axios.get(geocodeUrl);
                 if (geoRes.data && geoRes.data.features && geoRes.data.features.length > 0) {
                    const [longitude, latitude] = geoRes.data.features[0].center;
                    updatedFields.geolocation = {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    };
                }
            }
        }
        // --- END GEOCODING LOGIC ---

        location = await Location.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        res.json(location);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE /api/admin/locations/:id
// @desc    Delete a location
// @access  Private (Admin)
router.delete('/locations/:id', [auth, adminAuth], async (req, res) => {
    try {
        let location = await Location.findById(req.params.id);
        if (!location) return res.status(404).json({ msg: 'Location not found' });

        await Location.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Location removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
