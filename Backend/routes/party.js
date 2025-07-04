const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const partyController = require('../controllers/partyController');
const { upload } = require('../middleware/upload');

// Get all parties (for dropdown etc.)
router.get('/', isAuthenticated, partyController.getAllParties);

// Get a single party by ID
router.get('/:id', isAuthenticated, partyController.getPartyById);

// Create a new party (admin only)
router.post(
  '/',
  isAuthenticated,
  isAdmin,
  upload.single('symbol'), // Ensure 'symbol' matches your frontend form field name
  partyController.createParty
);

// Update a party by ID (admin only)
router.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  upload.single('symbol'),
  partyController.updateParty
);

// Delete a party by ID (admin only)
router.delete('/:id', isAuthenticated, isAdmin, partyController.deleteParty);

// Get members of a party by party ID
router.get('/:id/members', isAuthenticated, partyController.getPartyMembers);

module.exports = router;
