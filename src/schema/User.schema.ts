import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  userType: 'buyer' | 'seller';
  password: string;
  createdAt: Date;
  isValidPassword(password: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['buyer', 'seller'],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash the password
  next();
});

// Method to validate password
userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password); // Compare input password with hashed password
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign({ _id: this._id, userType: this.userType }, process.env.JWT_SECRET as string, {
    expiresIn: '1d', 
  });
  return token;
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
