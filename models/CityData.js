const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CityDataSchema = new Schema({
    city: {
        type: String,
        required: true,
        unique: true // Each city has one entry
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    avgMeal: {
        budget: { type: Number }, // e.g., Food court / fast food
        mid: { type: Number },    // e.g., Casual sit-down restaurant
        fine: { type: Number }    // e.g., High-end restaurant
    },
    avgDrink: {
        type: Number // Average cost of a beer/wine in a bar
    },
    avgAirportRide: {
        taxi: { type: Number },
        rideshare: { type: Number } // e.g., Uber/Lyft
    },
    dataSource: {
        type: String // URL or name of the source for the data
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Seed the database with some initial data for Las Vegas if it's empty
const CityData = mongoose.model('CityData', CityDataSchema);

CityData.countDocuments({}).then(count => {
  if (count === 0) {
    console.log('No city data found. Seeding initial data for Las Vegas...');
    CityData.create({
        city: 'Las Vegas',
        currency: 'USD',
        avgMeal: {
            budget: 20,
            mid: 50,
            fine: 150
        },
        avgDrink: 12,
        avgAirportRide: {
            taxi: 30,
            rideshare: 25
        },
        dataSource: 'Internal estimates'
    }).then(() => console.log('City data seeded!'))
      .catch(err => console.error('Error seeding city data:', err));
  }
});

module.exports = CityData;
