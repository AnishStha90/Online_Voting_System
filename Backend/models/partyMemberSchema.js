const mongoose = require('mongoose');

const partyMemberSchema = new mongoose.Schema(
  {
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',  // Refers to the Party model
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PartyMember', partyMemberSchema);
