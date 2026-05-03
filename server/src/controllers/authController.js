// Get all users (for admin panel member assignment)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json(errors.array());

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashed, role: "Member" });

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json(errors.array());

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid creds" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid creds" });

    res.json({ token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};