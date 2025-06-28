const Election = require('../models/Election');
const Party = require('../models/Party');

// Create a new election
exports.createElection = async (req, res) => {
  try {
    const { title, description, posts, startDate, endDate } = req.body;

    if (!title || !posts || !startDate || !endDate) {
      return res.status(400).json({ error: 'Title, posts, startDate, and endDate are required.' });
    }

    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ error: 'Posts must be a non-empty array.' });
    }

    for (const post of posts) {
      if (!post.name || !Array.isArray(post.candidates) || post.candidates.length === 0) {
        return res.status(400).json({ error: 'Each post must have a name and at least one candidate.' });
      }

      for (const candidate of post.candidates) {
        if (!candidate.party || !candidate.member) {
          return res.status(400).json({ error: 'Each candidate must have both a party and a member.' });
        }
      }
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ error: 'End date must be after start date.' });
    }

    const election = new Election({
      title,
      description,
      posts,
      startDate,
      endDate,
    });

    await election.save();

    res.status(201).json({ message: 'Election created successfully', election });
  } catch (err) {
    console.error('Election creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all elections
exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.find().lean();
    res.json({ elections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get election by ID
exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('posts.candidates', 'name')
      .lean();

    if (!election) return res.status(404).json({ error: 'Election not found' });

    res.json(election);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update election
exports.updateElection = async (req, res) => {
  try {
    const { title, description, posts, parties, startDate, endDate } = req.body;

    if (!title || !posts || !parties || !startDate || !endDate) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    if (!Array.isArray(posts) || posts.length === 0) {
      return res.status(400).json({ error: 'Posts must be a non-empty array.' });
    }

    if (!Array.isArray(parties) || parties.length === 0) {
      return res.status(400).json({ error: 'Parties must be a non-empty array.' });
    }

    const validParties = await Party.find({ _id: { $in: parties } }).select('_id').lean();
    if (validParties.length !== parties.length) {
      return res.status(400).json({ error: 'Invalid party ID(s).' });
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ error: 'End date must be after start date.' });
    }

    const formattedPosts = posts.map((postName) => ({
      name: postName,
      candidates: parties,
    }));

    const election = await Election.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        posts: formattedPosts,
        startDate,
        endDate,
      },
      { new: true }
    );

    if (!election) return res.status(404).json({ error: 'Election not found' });

    res.json({ message: 'Election updated successfully', election });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete election
exports.deleteElection = async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    if (!election) return res.status(404).json({ error: 'Election not found' });

    res.json({ message: 'Election deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
