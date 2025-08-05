const express = require('express');
const router = express.Router();
const { submitVote, checkVote, getVotesByElection } = require('../controllers/voteController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/submit', isAuthenticated, submitVote);
router.get('/check/:electionId', isAuthenticated, checkVote);
router.get('/election/:electionId', isAuthenticated, getVotesByElection); // 👈 NEW route

module.exports = router;
