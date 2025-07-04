const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const inquiresController = require("../controllers/inquiresController");

// Public route - create inquiry
router.post("/", inquiresController.createInquire);

// Admin-only routes
router.get("/", isAuthenticated, isAdmin, inquiresController.getAllInquires);
router.get("/:id", isAuthenticated, isAdmin, inquiresController.getInquireById);
router.put("/:id/reply", isAuthenticated, isAdmin, inquiresController.replyToInquiry);
router.delete("/:id", isAuthenticated, isAdmin, inquiresController.deleteInquire);

module.exports = router;
