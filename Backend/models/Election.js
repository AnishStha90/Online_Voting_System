const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Party',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PartyMember',
    required: true
  }
});

const PostSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  candidates: [CandidateSchema]
});

const ElectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  posts: [PostSchema]
});

module.exports = mongoose.model('Election', ElectionSchema);
