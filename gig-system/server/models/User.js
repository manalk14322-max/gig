import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    title: { type: String, default: '' },
    location: { type: String, default: 'Pakistan' },
    avatarUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    skills: [{ type: String }],
    portfolio: [{ type: String }],
    university: { type: String, default: '' },
    universityEmail: { type: String, default: '' },
    department: { type: String, default: '' },
    studentId: { type: String, default: '' },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedStudent: { type: Boolean, default: false },
    verificationDocs: {
      idImage: { type: String, default: '' },
      selfieImage: { type: String, default: '' },
      requestedAt: { type: Date },
    },
    verificationHistory: [
      {
        status: { type: String },
        note: { type: String },
        decidedAt: { type: Date },
        decidedBy: { type: String },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model('User', UserSchema);
