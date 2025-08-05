const Feedback = require("../models/feedback");

// Get all feedback (Admin only)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

// Get feedback by email (Admin or user)
exports.getFeedbackByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    const feedbacks = await Feedback.find({ email }).sort({ createdAt: -1 });

    if (!feedbacks.length) {
      return res.status(404).json({
        success: false,
        message: "No feedback found for this email",
      });
    }

    res.status(200).json({
      success: true,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

// Create feedback (Admin only)
exports.createFeedback = async (req, res) => {
  try {
    const { email, message, createdByAdmin } = req.body;

    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: "Email and message are required",
      });
    }

    const feedback = new Feedback({
      email,
      message,
      createdByAdmin: createdByAdmin || false,
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback created successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create feedback",
      error: error.message,
    });
  }
};
