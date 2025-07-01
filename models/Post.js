const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This schema defines the structure for a single forum post.
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  authorEmail: {
    type: String,
    required: true
  },
  // NEW: Store the user's rank for historical display
  authorRank: {
      type: String,
      default: 'New Hand'
  },
  city: {
    type: String
  },
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    authorEmail: { type: String },
    text: { type: String, required: true },
    authorRank: { type: String, default: 'New Hand' }, // Also store rank for commenters
    date: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
