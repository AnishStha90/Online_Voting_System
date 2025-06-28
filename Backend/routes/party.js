const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const partyController = require('../controllers/partyController');
const { upload } = require('../middleware/upload');

// ✅ Get all parties
router.get('/', isAuthenticated, partyController.getAllParties);

// ✅ Get a single party by ID
router.get('/:id', isAuthenticated, partyController.getPartyById);

// ✅ Create a party (admin only)
router.post('/', isAuthenticated, isAdmin, upload.single('symbol'), partyController.createParty);

// ✅ Update a party by ID
router.put('/:id', isAuthenticated, isAdmin, upload.single('symbol'), partyController.updateParty);

// ✅ Delete a party by ID
router.delete('/:id', isAuthenticated, isAdmin, partyController.deleteParty);

// ✅ Get members by party ID
router.get('/:id/members', isAuthenticated, partyController.getPartyMembers); // <-- matches frontend call

module.exports = router;
