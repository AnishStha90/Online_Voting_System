const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Create election (admin only)
router.post('/', isAuthenticated, isAdmin, electionController.createElection);

// Get all elections (any authenticated user)
router.get('/', isAuthenticated, electionController.getAllElections);

// Get election by ID (any authenticated user)
router.get('/:id', isAuthenticated, electionController.getElectionById);

// Update election (admin only)
router.put('/:id', isAuthenticated, isAdmin, electionController.updateElection);

// Delete election (admin only)
router.delete('/:id', isAuthenticated, isAdmin, electionController.deleteElection);

module.exports = router;
