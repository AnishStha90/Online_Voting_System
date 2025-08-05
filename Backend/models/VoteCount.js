const mongoose = require('mongoose');

const voteCountSchema = new mongoose.Schema({
  election: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Election', 
    required: true,
    index: true,
  },
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true,
    index: true,
  },
  candidate: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Candidate', 
    required: true,
    index: true,
  },
  count: { 
    type: Number, 
    default: 0 
  },
}, { timestamps: true });

// Ensure uniqueness for fast upserts
voteCountSchema.index({ election: 1, post: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('VoteCount', voteCountSchema);
