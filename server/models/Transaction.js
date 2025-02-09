import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['grocery', 'entertainment', 'clothing', 'bills', 'restaurant', 'transportation', 'income']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Transaction', transactionSchema); 