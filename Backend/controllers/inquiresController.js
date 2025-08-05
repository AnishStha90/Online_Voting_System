const Inquire = require("../models/inquire");
const Feedback = require("../models/feedback");

// Create new inquiry
exports.createInquire = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newInquire = new Inquire({
      name,
      email,
      message,
    });

    await newInquire.save();

    res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully",
      data: newInquire,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
      error: error.message,
    });
  }
};

// Get all inquiries (admin)
exports.getAllInquires = async (req, res) => {
  try {
    const inquires = await Inquire.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: inquires,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
      error: error.message,
    });
  }
};

// Get a single inquiry by ID (admin)
exports.getInquireById = async (req, res) => {
  try {
    const { id } = req.params;
    const inquire = await Inquire.findById(id);

    if (!inquire) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: inquire,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiry",
      error: error.message,
    });
  }
};

// Reply to inquiry (admin)
exports.replyToInquiry = async (req, res) => {
  const { id } = req.params;
  const { replyMessage } = req.body;

  if (!replyMessage) {
    return res.status(400).json({ message: "Reply message is required" });
  }

  try {
    const inquiry = await Inquire.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    // Create feedback linked by email (KEY FIX)
    const feedback = new Feedback({
      email: inquiry.email,     // <-- Add email here to link feedback to user
      message: replyMessage,
      createdByAdmin: true,
    });

    await feedback.save();

    inquiry.replied = true;
    await inquiry.save();

    return res.status(200).json({ message: "Reply sent successfully", feedback });
  } catch (error) {
    console.error("Error replying to inquiry:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// controllers/inquiresController.js
exports.deleteInquire = async (req, res) => {
  try {
    const deleted = await Inquire.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }
    res.status(200).json({ success: true, message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
