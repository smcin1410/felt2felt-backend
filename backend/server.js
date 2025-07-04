// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import the scheduled job initializer
const initScheduledJobs = require('./jobs/cleanup');

// Load environment variables from .env file
dotenv.config();

// Initialize an Express application
const app = express();
const PORT = process.env.PORT || 5000;

// --- DEBUGGING LOGS ---
// These lines will print to your Render logs on startup to confirm the variables are correct.
console.log(`--- Server Starting ---`);
console.log(`BACKEND_URL from environment: ${process.env.BACKEND_URL}`);
console.log(`Server will run on port: ${PORT}`);
console.log(`-----------------------`);


// --- Connect to MongoDB ---
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
    initScheduledJobs();
  })
  .catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// --- Middleware ---
const allowedOrigins = ['https://felt2felt.com', 'https://www.felt2felt.com'];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions));
app.use(express.json());

// --- Define Routes ---
app.get('/', (req, res) => {
  res.send('Felt2Felt API Server is running...');
});

// Use the existing routes
app.use('/api/users', require('./routes/users'));
app.use('/api/itinerary', require('./routes/itinerary'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/tournaments', require('./routes/tournaments'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/citydata', require('./routes/cityData'));


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
