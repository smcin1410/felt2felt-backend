const mongoose = require('mongoose');

// This sub-schema defines the structure for a specific cash game offered at a location.
// Storing this as structured data allows for detailed filtering and searching.
const CashGameSchema = new mongoose.Schema({
    game: {
        type: String,
        required: true,
        trim: true,
        default: 'No-Limit Hold\'em'
    },
    stakes: {
        type: String, // e.g., "$1/$3", "$2/$5"
        required: true,
        trim: true
    },
    maxBuyin: {
        type: Number
    }
});

// This is the main schema for the 'locations' collection.
const LocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Location name is required.'],
        trim: true,
        unique: true
    },
    address: {
        type: String,
        required: [true, 'Address is required.'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required.'],
        trim: true
    },
    region: {
        type: String, // State or Province
        required: [true, 'Region/State is required.'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'Country is required.'],
        trim: true
    },
    // The GeoJSON Point schema is used for storing geographic coordinates.
    // This is essential for geospatial queries (e.g., "find all rooms within 5km").
    geolocation: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere' // Creates a geospatial index for efficient location-based searches.
        }
    },
    // Qualitative data helps users find the right vibe.
    atmosphere: {
        type: String,
        trim: true,
        enum: ['Upscale', 'Casual', 'Tourist-heavy', 'Local-centric', 'Grind-focused']
    },
    primaryPlayerType: {
        type: String,
        trim: true,
        enum: ['Professional', 'Recreational', 'Mixed']
    },
    // Differentiates between standard casino rooms and private clubs.
    businessModel: {
        type: String,
        trim: true,
        enum: ['Rake-based', 'Membership/Time-based']
    },
    businessModelNotes: {
        type: String,
        trim: true
    },
    // The 'details' object nests more specific information about the poker room.
    details: {
        tables: {
            type: Number,
            default: 0
        },
        // Embeds an array of the CashGameSchema defined above.
        cashGames: [CashGameSchema],
        tournaments: {
            type: String, // A text description of regular tournament offerings.
            trim: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Location', LocationSchema);
