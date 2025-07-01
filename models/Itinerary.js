const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItineraryItemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user', // This links the item to a specific user
    required: true
  },
  itemType: { // e.g., 'room', 'tournament'
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  city: {
    type: String
  },
  dates: {
    type: String
  },
  buyin: {
    type: Number
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ItineraryItem', ItineraryItemSchema);
