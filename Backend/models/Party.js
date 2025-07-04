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
  affiliatedPoliticalParty: {
    type: String, // or mongoose.Schema.Types.ObjectId if it's a reference to another party
  },
  establishedDate: {
    type: Date,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PartyMember',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Party', partySchema);
