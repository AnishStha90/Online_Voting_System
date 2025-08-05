const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Admin only
router.get("/", feedbackController.getAllFeedback);

// Admin or user
router.get("/user-email/:email", feedbackController.getFeedbackByEmail);

// Admin only
router.post("/", feedbackController.createFeedback);

module.exports = router;
