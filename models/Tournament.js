const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for an individual event within a series
const EventSchema = new Schema({
  date: { type: String, required: true },
  eventName: { type: String, required: true },
  buyin: { type: String, required: true }, // Using String to accommodate bounties, e.g., "$500 + $50"
  guarantee: { type: String } // e.g., "$1M GTD"
});

// Schema for the overall tournament series
const TournamentSeriesSchema = new Schema({
  seriesName: { type: String, required: true },
  venue: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  circuit: { type: String }, // e.g., "WSOP Circuit", "WPT"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  officialSite: { type: String },
  schedule: [EventSchema] // An array of individual events
});

const TournamentSeries = mongoose.model('TournamentSeries', TournamentSeriesSchema);

// Seed the database with initial data if it's empty
TournamentSeries.countDocuments({}).then(count => {
  if (count === 0) {
    console.log('No tournament series found. Seeding initial data...');
    TournamentSeries.insertMany([
      {
        seriesName: "World Series of Poker",
        venue: "Horseshoe & Paris",
        location: "Las Vegas, NV",
        city: "Las Vegas",
        country: "USA",
        circuit: "WSOP",
        startDate: "2025-05-28",
        endDate: "2025-07-17",
        officialSite: "https://www.wsop.com",
        schedule: [
          { date: "May 28", eventName: "Event #1: Champions Reunion No-Limit Hold'em Freezeout", buyin: "$5,000", guarantee: "$5M" },
          { date: "May 29", eventName: "Event #3: $500 Kick-Off No-Limit Hold'em Freezeout", buyin: "$500", guarantee: "$1M" },
          { date: "June 28", eventName: "Event #68: MAIN EVENT No-Limit Hold'em World Championship", buyin: "$10,000", guarantee: "$50M" }
        ]
      },
      {
        seriesName: "WPT World Championship Festival",
        venue: "Wynn Las Vegas",
        location: "Las Vegas, NV",
        city: "Las Vegas",
        country: "USA",
        circuit: "WPT",
        startDate: "2025-12-03",
        endDate: "2025-12-20",
        officialSite: "https://www.wynnpoker.com",
        schedule: [
            { date: "Dec 3", eventName: "WPT Prime Championship", buyin: "$1,100", guarantee: "$5M" },
            { date: "Dec 12", eventName: "WPT World Championship", buyin: "$10,400", guarantee: "$40M" }
        ]
      },
      {
        seriesName: "Seminole Hard Rock Poker Open",
        venue: "Seminole Hard Rock",
        location: "Hollywood, FL",
        city: "South Florida",
        country: "USA",
        circuit: "SHRPO",
        startDate: "2025-07-24",
        endDate: "2025-08-06",
        officialSite: "https://www.shrpo.com",
        schedule: [
            { date: "July 24", eventName: "Event #1: $400 Deep Stack NLH", buyin: "$400", guarantee: "$1M" },
            { date: "Aug 2", eventName: "SHRPO Championship", buyin: "$5,300", guarantee: "$3M" }
        ]
      }
    ]).then(() => console.log('Tournaments seeded!'))
      .catch(err => console.error('Error seeding tournaments:', err));
  }
});

module.exports = TournamentSeries;
