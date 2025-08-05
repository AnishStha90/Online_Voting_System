const Vote = require('../models/Vote');
const User = require('../models/User');
const Election = require('../models/Election');


// Submit vote
const submitVote = async (req, res) => {
  try {
    const { electionId, votes } = req.body;
    const userId = req.user.id;

    if (!electionId || !Array.isArray(votes) || votes.some(v => !v.postId || !v.candidateId)) {
      return res.status(400).json({ message: 'Invalid vote submission data' });
    }

    const existingVote = await Vote.findOne({ election: electionId, user: userId });
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    const newVote = new Vote({
      election: electionId,
      user: userId,
      votes,
    });

    await newVote.save();

    await User.findByIdAndUpdate(userId, { hasVoted: true });

    return res.status(201).json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return res.status(500).json({ message: 'Server error while submitting vote' });
  }
};

// Check if user already voted
const checkVote = async (req, res) => {
  try {
    const { electionId } = req.params;
    const userId = req.user.id;

    const existingVote = await Vote.findOne({ election: electionId, user: userId });

    if (existingVote) {
      return res.status(200).json({ voted: true, message: 'User has already voted' });
    } else {
      return res.status(200).json({ voted: false, message: 'User has not voted yet' });
    }
  } catch (error) {
    console.error('Error checking vote:', error);
    return res.status(500).json({ message: 'Server error while checking vote' });
  }
};

// Get vote counts by election (for live results or admin)
const getVotesByElection = async (req, res) => {
  try {
    const { electionId } = req.params;

    // Find election with posts and candidates
    const election = await Election.findById(electionId).lean();
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Find all votes for this election
    const votes = await Vote.find({ election: electionId }).lean();

    // Build a tally: { postId: { candidateId: count } }
    const tally = {};

    for (const vote of votes) {
      for (const entry of vote.votes) {
        const { postId, candidateId } = entry;

        if (!tally[postId]) tally[postId] = {};
        if (!tally[postId][candidateId]) tally[postId][candidateId] = 0;

        tally[postId][candidateId]++;
      }
    }

    // Build results array with post and candidate info + votes
    const results = election.posts.map(post => {
      const postVotes = tally[post._id.toString()] || {};

      // For each candidate, get votes count or 0
      const candidates = post.candidates.map(candidate => ({
        candidateId: candidate._id.toString(),
        // You can add more candidate info here, e.g. party name, member name
        party: candidate.party?.toString() || 'Unknown Party',
        member: candidate.member?.toString() || 'Unknown Member',
        votes: postVotes[candidate._id.toString()] || 0,
      }));

      return {
        postId: post._id.toString(),
        postName: post.name,
        candidates,
      };
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Error getting votes:', error);
    return res.status(500).json({ message: 'Server error while fetching vote results' });
  }
};

module.exports = {
  submitVote,
  checkVote,
  getVotesByElection,
};