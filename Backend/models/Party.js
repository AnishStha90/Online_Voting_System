const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  symbol: {
    type: String, // image path (e.g., "/uploads/party1.png")
    required: true,
  },
  description: {
    type: String,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PartyMember',  // <-- Correct reference here
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Party', partySchema);
