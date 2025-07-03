const fs = 'fs'; // This is a placeholder, seeder scripts often don't need fs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Location = require('./models/Location');
const Tournament = require('./models/Tournament');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// --- SAMPLE DATA ---

const locations = [
  {
    _id: "6684a1a7d5a8a4f3d8a7b001", // Static ID for easy reference
    name: "Horseshoe / Paris Las Vegas",
    address: "3645 S Las Vegas Blvd, Las Vegas, NV 89109",
    city: "Las Vegas",
    region: "NV",
    country: "United States",
    atmosphere: 'Tourist-heavy',
    primaryPlayerType: 'Mixed',
    businessModel: 'Rake-based',
    details: {
      tables: 50, // Approximate for the WSOP setup
      tournaments: "Home of the World Series of Poker (WSOP)."
    }
  },
  {
    _id: "6684a1a7d5a8a4f3d8a7b002", // Static ID for easy reference
    name: "Wynn Las Vegas",
    address: "3131 Las Vegas Blvd S, Las Vegas, NV 89109",
    city: "Las Vegas",
    region: "NV",
    country: "United States",
    atmosphere: 'Upscale',
    primaryPlayerType: 'Professional',
    businessModel: 'Rake-based',
    details: {
      tables: 28,
      cashGames: [
          { game: "No-Limit Hold'em", stakes: "$1/$3", maxBuyin: 500 },
          { game: "No-Limit Hold'em", stakes: "$2/$5", maxBuyin: 1500 },
          { game: "Pot-Limit Omaha", stakes: "$1/$2", maxBuyin: 500 }
      ],
      tournaments: "Runs daily tournaments and the prestigious Wynn Summer Classic."
    }
  },
  {
    _id: "6684a1a7d5a8a4f3d8a7b003", // Static ID for easy reference
    name: "Aria Resort & Casino",
    address: "3730 S Las Vegas Blvd, Las Vegas, NV 89158",
    city: "Las Vegas",
    region: "NV",
    country: "United States",
    atmosphere: 'Upscale',
    primaryPlayerType: 'Professional',
    businessModel: 'Rake-based',
    details: {
      tables: 24,
      cashGames: [
          { game: "No-Limit Hold'em", stakes: "$1/$3", maxBuyin: 500 },
          { game: "No-Limit Hold'em", stakes: "$2/$5", maxBuyin: 2000 },
          { game: "Pot-Limit Omaha", stakes: "$5/$10", maxBuyin: 3000 }
      ],
      tournaments: "Home of the Aria Poker Classic and various high roller events."
    }
  }
];

const tournaments = [
  {
    seriesName: "56th World Series of Poker - WSOP 2025",
    majorCircuit: "WSOP",
    venueId: "6684a1a7d5a8a4f3d8a7b001", // Reference to Horseshoe/Paris
    city: "Las Vegas",
    region: "NV",
    country: "United States",
    startDate: "2025-05-27",
    endDate: "2025-07-16",
    officialSite: "https://www.wsop.com",
    tags: ['las-vegas-summer-2025'],
    schedule: [
      { eventNumber: "#1", eventName: "$1,000 Mystery Millions", date: "May 27 - Jun 2", buyin: "$1,000", guarantee: "$1,000,000 to 1st" },
      { eventNumber: "#19", eventName: "$500 Colossus NLH", date: "Jun 4 - Jun 8", buyin: "$500", guarantee: "$3,000,000" },
      { eventNumber: "#37", eventName: "$1,500 Monster Stack NLH", date: "Jun 11 - Jun 15", buyin: "$1,500" },
      { eventNumber: "#53", eventName: "$1,500 Millionaire Maker", date: "Jun 18 - Jun 22", buyin: "$1,500", guarantee: "$1,000,000 to 1st" },
      { eventNumber: "#81", eventName: "$10,000 Main Event World Championship", date: "Jul 2 - Jul 16", buyin: "$10,000", gameType: "No Limit Hold'em" }
    ]
  },
  {
    seriesName: "Wynn Summer Classic 2025",
    majorCircuit: "Independent",
    venueId: "6684a1a7d5a8a4f3d8a7b002", // Reference to Wynn
    city: "Las Vegas",
    region: "NV",
    country: "United States",
    startDate: "2025-05-21",
    endDate: "2025-07-14",
    officialSite: "https://www.wynnlasvegas.com/casino/poker",
    tags: ['las-vegas-summer-2025'],
    schedule: [
      { eventName: "$1,100 NLH", date: "May 22 - May 25", buyin: "$1,100", guarantee: "$500,000" },
      { eventName: "$3,500 NLH Championship", date: "Jun 12 - Jun 15", buyin: "$3,500", guarantee: "$4,000,000" },
      { eventName: "$1,600 Mystery Bounty", date: "Jun 23 - Jun 26", buyin: "$1,600", guarantee: "$2,500,000" }
    ]
  },
  {
    seriesName: "Aria Poker Classic 2025",
    majorCircuit: "Independent",
    venueId: "6684a1a7d5a8a4f3d8a7b003", // Reference to Aria
    city: "Las Vegas",
    region: "NV",
    country: "United States",
    startDate: "2025-05-28",
    endDate: "2025-07-13",
    officialSite: "https://aria.mgmresorts.com/en/casino/poker.html",
    tags: ['las-vegas-summer-2025'],
    schedule: [
        { eventName: "$600 NLH", date: "May 29 - Jun 1", buyin: "$600", guarantee: "$500,000" },
        { eventName: "$1,100 NLH", date: "Jun 5 - Jun 8", buyin: "$1,100", guarantee: "$1,000,000" }
    ]
  }
];

// Import into DB
const importData = async () => {
  try {
    await Location.deleteMany();
    await Tournament.deleteMany();
    
    await Location.create(locations);
    await Tournament.create(tournaments);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Location.deleteMany();
    await Tournament.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// This allows you to run the script from the command line
// with arguments like: node seeder -i (to import) or node seeder -d (to delete)
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
