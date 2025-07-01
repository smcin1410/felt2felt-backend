const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This schema will store the poker room information that we will display on the Destinations page.
// In a real-world application, you would have an admin panel to manage this data.
// For now, we will pre-populate it directly in the database.
const DestinationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  region: { // e.g., State or Province
    type: String,
    required: true,
  },
  heroImage: {
    type: String,
    required: true,
  },
  details: {
    tables: Number,
    cashGames: String,
    tournaments: String,
  },
  mapCoords: {
    lat: Number,
    lng: Number,
  }
});

// Seed the database with some initial data if it's empty
const Destination = mongoose.model('Destination', DestinationSchema);

Destination.countDocuments({}).then(count => {
  if (count === 0) {
    console.log('No destinations found. Seeding initial data...');
    Destination.insertMany([
        { name: 'Bellagio', location: 'Las Vegas Strip', city: 'Las Vegas', country: 'USA', region: 'Nevada', heroImage: 'https://felt2felt.com/wp-content/uploads/2025/06/VegasStreet-scaled.jpeg', details: { tables: 37, cashGames: 'NLH, PLO, Mixed', tournaments: 'Daily & WPT Series' }, mapCoords: { lat: 36.1132, lng: -115.1767 } },
        { name: 'Aria', location: 'Las Vegas Strip', city: 'Las Vegas', country: 'USA', region: 'Nevada', heroImage: 'https://images.pexels.com/photos/161852/architecture-building-city-construction-161852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', details: { tables: 24, cashGames: 'NLH, PLO, High Stakes', tournaments: 'High Roller Series' }, mapCoords: { lat: 36.1075, lng: -115.1764 } },
        { name: 'Seminole Hard Rock', location: 'Hollywood, FL', city: 'South Florida', country: 'USA', region: 'Florida', heroImage: 'https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', details: { tables: 45, cashGames: 'NLH, PLO, H.O.R.S.E.', tournaments: 'WPT & SHRPO Series' }, mapCoords: { lat: 26.0521, lng: -80.2118 } },
        { name: 'The Victoria Casino (The Vic)', location: 'Edgware Road, London', city: 'London', country: 'UK', region: 'England', heroImage: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', details: { tables: 30, cashGames: 'NLH, PLO', tournaments: 'UKIPT & GUKPT' }, mapCoords: { lat: 51.5171, lng: -0.1636 } }
    ]).then(() => console.log('Destinations seeded!'))
      .catch(err => console.error('Error seeding destinations:', err));
  }
});


module.exports = Destination;
