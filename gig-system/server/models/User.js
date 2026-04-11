import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    title: { type: String, default: '' },
    location: { type: String, default: 'Pakistan' },
    avatarUrl: { type: String, default: '' },
    portfolio: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
