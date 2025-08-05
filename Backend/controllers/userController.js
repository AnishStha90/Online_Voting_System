const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOTP, emailSender } = require('../utils/otpEmail');
const crypto = require('crypto');
const Token = require('../models/token');

const API = process.env.API_URL || 'http://localhost:5000';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}


function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const diffMs = Date.now() - dob.getTime();
  const ageDate = new Date(diffMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// -------------------- REGISTER --------------------
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, gender, studentid, district } = req.body;

    if (!name || !email || !password || !phone || !dateOfBirth || !district || !gender || !studentid) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits.' });
    }

    const age = calculateAge(dateOfBirth);
    if (age < 16) {
      return res.status(400).json({ error: 'You must be at least 16 years old to register.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'User photo is required.' });
    }

   const existingEmail = await User.findOne({ email });
if (existingEmail) {
  return res.status(400).json({ error: 'Email is already registered.' });
}

const existingStudentId = await User.findOne({ studentid });
if (existingStudentId) {
  return res.status(409).json({ error: 'This student ID is already in use, check your ID' });
}


    const hashedPassword = await bcrypt.hash(password, 10);
   
    const imagePath = 'uploads/' + req.file.filename;

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      gender,
      studentid,
      image: imagePath,
      district,
      role: 'voter',
      isVerified: false,
    });

    await user.save();

    const tokenString = crypto.randomBytes(24).toString('hex');
    const verificationToken = new Token({
      user: user._id,
      token: tokenString,
    });

    await verificationToken.save();

    const verifyURL = `${API}/verify/${tokenString}`;
    await emailSender({
      from: 'noreply@yourdomain.com',
      to: user.email,
      subject: 'Verify Your Email',
      html: `<p>Click the button below to verify your email:</p>
            <a href="${verifyURL}"><button>Verify Now</button></a>`
    });

    res.status(201).json({ message: 'User registered successfully. Check your email to verify your account.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

// -------------------- LOGIN --------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ error: 'User not found or not verified.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    // ✅ Skip OTP for admin login
    if (user.role === 'admin') {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        message: 'Admin login successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
          district: user.district,
          gender: user.gender
        }
      });
    }

    // ✅ For voters, generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTP(user.email, otp);

    res.json({ message: 'OTP sent to email for login verification.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- VERIFY LOGIN OTP --------------------
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        district: user.district,
        gender: user.gender,
        student: user.studentid
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET PROFILE --------------------
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -pin');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- UPDATE PROFILE --------------------
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, district } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (district) user.district = district;

    await user.save();
    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET ALL USERS --------------------
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -pin');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DELETE USER --------------------
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- VERIFY EMAIL --------------------
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).send(`<h2>Verification token is required.</h2>`);
    }

    const storedToken = await Token.findOne({ token }).populate('user');
    if (!storedToken || !storedToken.user) {
      return res.status(400).send(`<h2>Invalid or expired token.</h2>`);
    }

    storedToken.user.isVerified = true;
    await storedToken.user.save();
    await storedToken.deleteOne();

    res.send(`<h2>Email verified successfully!</h2><p>You can now log in.</p>`);
  } catch (err) {
    res.status(500).send(`<h2>Verification failed</h2><p>${err.message}</p>`);
  }
};
