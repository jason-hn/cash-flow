import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    sparse: true
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Only hash password for non-Google users
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && !this.isGoogleUser) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema); 