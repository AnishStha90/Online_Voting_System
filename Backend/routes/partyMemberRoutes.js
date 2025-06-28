const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const partyMemberController = require('../controllers/PartyMemberController');

// Create a new party member (admin only)
router.post(
  '/',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  partyMemberController.createPartyMember
);

// Get all party members (admin only)
router.get(
  '/',
  isAuthenticated,
  isAdmin,
  partyMemberController.getAllPartyMembers
);

// Get members by partyId (any authenticated user)
router.get(
  '/byParty/:partyId',
  isAuthenticated,
  partyMemberController.getPartyMembersByPartyId
);

// Get a specific party member by member ID (admin only)
router.get(
  '/:id',
  isAuthenticated,
  isAdmin,
  partyMemberController.getPartyMemberByMemberId
);

// Update a party member (admin only)
router.put(
  '/:id',
  isAuthenticated,
  isAdmin,
  upload.single('image'),
  partyMemberController.updatePartyMember
);

// Delete a party member (admin only)
router.delete(
  '/:id',
  isAuthenticated,
  isAdmin,
  partyMemberController.deletePartyMember
);

module.exports = router;
