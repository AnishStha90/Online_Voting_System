const PartyMember = require('../models/partyMemberSchema');
const Party = require('../models/Party');

// ✅ Create a new party member
exports.createPartyMember = async (req, res) => {
  try {
    const { name, phone, email, dateOfBirth, party } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Validate party
    const partyExists = await Party.findById(party);
    if (!partyExists) {
      return res.status(400).json({ error: 'Invalid party ID' });
    }

    const newMember = new PartyMember({
      name,
      phone,
      email,
      dateOfBirth,
      party,
      image: 'uploads/' + req.file.filename,
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all party members
exports.getAllPartyMembers = async (req, res) => {
  try {
    const members = await PartyMember.find().populate('party');
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single party member by member ID
exports.getPartyMemberByMemberId = async (req, res) => {
  try {
    const memberId = req.params.id;
    const member = await PartyMember.findById(memberId).populate('party');

    if (!member) {
      return res.status(404).json({ message: 'Party member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching party member by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get members by party ID
exports.getPartyMembersByPartyId = async (req, res) => {
  try {
    const { partyId } = req.params;
    const members = await PartyMember.find({ party: partyId });

    if (!members || members.length === 0) {
      return res.status(200).json([]);
    }

    res.json(members);
  } catch (error) {
    console.error('Error fetching members by party:', error);
    res.status(500).json({ message: 'Server error fetching members' });
  }
};

// ✅ Update a party member
exports.updatePartyMember = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image = 'uploads/' + req.file.filename;
    }

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const updatedMember = await PartyMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Party member not found' });
    }

    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete a party member
exports.deletePartyMember = async (req, res) => {
  try {
    const deletedMember = await PartyMember.findByIdAndDelete(req.params.id);
    if (!deletedMember) {
      return res.status(404).json({ message: 'Party member not found' });
    }

    res.json({ message: 'Party member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
