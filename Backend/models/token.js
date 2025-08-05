const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const tokenSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {  // ✅ Use correct spelling and Date.now function
    type: Date,
    default: Date.now,
    expires: 86400  // 24 hours = 60 * 60 * 24
  }
});

module.exports = mongoose.model('Token', tokenSchema);
