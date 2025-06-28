const Party = require('../models/Party');
const mongoose = require('mongoose');
// ✅ Get all parties (only return what's needed for dropdowns)
exports.getAllParties = async (req, res) => {
  try {
    const parties = await Party.find().select('_id name symbol'); // Minimal fields
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch parties.' });
  }
};

// ✅ Get a single party by ID
exports.getPartyById = async (req, res) => {
 try {
    const partyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(partyId)) {
      return res.status(400).json({ message: 'Invalid party ID' });
    }

    const party = await Party.findById(partyId).populate('members');

    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }

    res.json(party);
  } catch (error) {
    console.error('Error in getPartyById:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Create a new party
exports.createParty = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !req.file) {
      return res.status(400).json({ error: 'Party name and symbol image are required.' });
    }

    const existing = await Party.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Party with this name already exists.' });
    }

    const symbol = `uploads/${req.file.filename}`; // Assuming multer stores files in /uploads

    const newParty = new Party({ name, symbol, description });
    await newParty.save();

    res.status(201).json({ message: 'Party created successfully.', party: newParty });
  } catch (err) {
    res.status(500).json({ error: 'Error creating party.' });
  }
};

// ✅ Update a party
exports.updateParty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (req.file) updateData.symbol = `uploads/${req.file.filename}`;

    const updatedParty = await Party.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedParty) {
      return res.status(404).json({ error: 'Party not found.' });
    }

    res.json({ message: 'Party updated successfully.', party: updatedParty });
  } catch (err) {
    res.status(500).json({ error: 'Error updating party.' });
  }
};

// ✅ Delete a party
exports.deleteParty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedParty = await Party.findByIdAndDelete(id);

    if (!deletedParty) {
      return res.status(404).json({ error: 'Party not found.' });
    }

    // Optional: Delete the symbol image from filesystem if needed

    res.json({ message: 'Party deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting party.' });
  }
};

// ✅ Get members of a party by ID
exports.getPartyMembers = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid party ID' });
    }

    const party = await Party.findById(id).populate('members', 'name email age image'); // adjust fields

    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    res.json({ members: party.members });
  } catch (err) {
    console.error('Error in getPartyMembers:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

