const mongoose = require('mongoose');

// This sub-schema defines the structure for a single event within a larger tournament series.
// It allows for a rich, detailed schedule to be stored directly within the parent tournament document.
const EventSchema = new mongoose.Schema({
    eventNumber: {
        type: String,
        trim: true
    },
    eventName: {
        type: String,
        required: [true, 'Event name is required.'],
        trim: true
    },
    date: {
        type: String, // Using String to accommodate flexible date formats like "Wed 18 - Sat 21 Jun"
        trim: true
    },
    buyin: {
        type: String, // Using String to handle complex buy-ins like "$700 + 300"
        trim: true
    },
    guarantee: {
        type: String,
        trim: true
    },
    gameType: {
        type: String,
        trim: true,
        default: 'No Limit Hold\'em'
    },
    notes: {
        type: String,
        trim: true
    }
});

// This is the main schema for the 'tournaments' collection.
const TournamentSchema = new mongoose.Schema({
    seriesName: {
        type: String,
        required: [true, 'Series name is required.'],
        trim: true,
        unique: true // Ensures no duplicate tournament series names are created.
    },
    majorCircuit: {
        type: String,
        trim: true,
        // Example circuits. This could be converted to an enum if a strict list is desired.
        // enum: ['WSOP', 'WPT', 'EPT', 'PGT', 'MSPT', 'Independent']
    },
    // venueId is a reference to a specific document in the 'locations' collection.
    // This creates a direct link between a tournament and where it's held.
    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
        // Not required, as some series might be online or have no fixed venue initially.
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
    startDate: {
        type: Date,
        required: [true, 'Start date is required.']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required.']
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Active', 'Completed'],
        default: 'Upcoming'
    },
    officialSite: {
        type: String,
        trim: true
    },
    // Tags enable the creation of "meta-series" to group events by theme,
    // like 'las-vegas-summer-2025', for powerful custom filtering on the frontend.
    tags: [String],
    // The schedule field embeds an array of the EventSchema defined above.
    schedule: [EventSchema]
}, {
    // Automatically adds `createdAt` and `updatedAt` fields to the document.
    timestamps: true
});

// Before saving a tournament, this middleware automatically updates its status
// based on the current date relative to the series start and end dates.
TournamentSchema.pre('save', function(next) {
    const now = new Date();
    if (this.endDate < now) {
        this.status = 'Completed';
    } else if (this.startDate <= now && this.endDate >= now) {
        this.status = 'Active';
    } else {
        this.status = 'Upcoming';
    }
    next();
});


module.exports = mongoose.model('Tournament', TournamentSchema);
