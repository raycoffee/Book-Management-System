import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = generateToken(user);
console.log(user);
    // Return both the token and userId
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFavoriteGenres = async (req, res) => {
  try {
    const { userId } = req.params;
    const { favoriteGenres } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { favoriteGenres },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update favorite genres.' });
  }
};