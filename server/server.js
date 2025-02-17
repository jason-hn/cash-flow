import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';
import Budget from './models/Budget.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import { authMiddleware } from './middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();
const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true 
}));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Get all transactions
app.get('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get transactions with period filter
app.get('/api/transactions/period', authMiddleware, async (req, res) => {
  try {
    const { period } = req.query;
    const today = new Date();
    let startDate;

    if (period === 'daily') {
      startDate = new Date(today.setHours(0, 0, 0, 0));
    } else if (period === 'monthly') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    const transactions = await Transaction.find({
      date: { $gte: startDate },
      user: req.userId
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add transaction
app.post('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.userId
    });
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update transaction
app.put('/api/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all budgets
app.get('/api/budgets', authMiddleware, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.userId });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add budget
app.post('/api/budgets', authMiddleware, async (req, res) => {
  try {
    // Check if budget for this category already exists for this user
    const existingBudget = await Budget.findOne({ 
      category: req.body.category,
      user: req.userId 
    });
    
    if (existingBudget) {
      return res.status(400).json({ 
        message: 'A budget for this category already exists' 
      });
    }

    const budget = new Budget({
      ...req.body,
      user: req.userId
    });
    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update budget
app.put('/api/budgets/:id', authMiddleware, async (req, res) => {
  try {
    const updatedBudget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(updatedBudget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete budget
app.delete('/api/budgets/:id', authMiddleware, async (req, res) => {
  try {
    const deletedBudget = await Budget.findOneAndDelete({ 
      _id: req.params.id,
      user: req.userId 
    });
    if (!deletedBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Auth Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user: { _id: user._id, email }, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user: { _id: user._id, email }, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Add this new route
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const { email, sub: googleId } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        googleId,
        password: Math.random().toString(36).slice(-8), // Random password for Google users
        isGoogleUser: true
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ user: { _id: user._id, email }, token });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ message: 'Google authentication failed' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
