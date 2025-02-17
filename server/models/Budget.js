import mongoose from 'mongoose';
import { CATEGORIES } from '../utils/constants.js';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORIES
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Budget amount must be a positive number'
    }
  }
});

// Ensure only one budget per category per user
budgetSchema.index({ user: 1, category: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema); 