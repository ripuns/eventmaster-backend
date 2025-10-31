const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: {
    type: Date,  // Changed from String to Date
    required: true
  },
  location: String,
  type: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendees: [String], // for storing emails invited manually
  participants: [{     // users who joined the event
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Event', eventSchema);