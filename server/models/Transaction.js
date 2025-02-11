import mongoose from 'mongoose';
import { CATEGORIES } from '../utils/constants.js';

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= 0; // Ensure amount is positive
      },
      message: 'Amount must be a positive number'
    }
  },
  category: {
    type: String,
    required: true,
    enum: CATEGORIES
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// Pre-save middleware to ensure amount is positive
transactionSchema.pre('save', function(next) {
  this.amount = Math.abs(this.amount);
  next();
});

export default mongoose.model('Transaction', transactionSchema); 