import mongoose from 'mongoose';
import { CATEGORIES } from '../utils/constants.js';

const budgetSchema = new mongoose.Schema({
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

// Ensure only one budget per category
budgetSchema.index({ category: 1 }, { unique: true });

export default mongoose.model('Budget', budgetSchema); 