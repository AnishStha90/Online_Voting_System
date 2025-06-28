const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  election: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [
    {
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
      candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vote', voteSchema);
