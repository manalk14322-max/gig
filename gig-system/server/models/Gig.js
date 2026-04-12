import mongoose from 'mongoose';

const ServiceItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    durationHours: { type: Number, required: true },
    included: [{ type: String }],
  },
  { _id: false },
);

const FreelancerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    portfolio: [{ type: String }],
    university: { type: String, default: '' },
    department: { type: String, default: '' },
    studentId: { type: String, default: '' },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedStudent: { type: Boolean, default: false },
  },
  { _id: false },
);

const FaqSchema = new mongoose.Schema(
  {
    question: { type: String, default: '' },
    answer: { type: String, default: '' },
  },
  { _id: false },
);

const RequirementSchema = new mongoose.Schema(
  {
    question: { type: String, default: '' },
    type: { type: String, default: 'text' },
    options: [{ type: String }],
    mandatory: { type: Boolean, default: false },
  },
  { _id: false },
);

const GigSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    basePrice: { type: Number, required: true },
    deliveryDays: { type: Number, required: true },
    quickTask: { type: Boolean, default: false },
    quickDeliveryHours: { type: Number, default: 2 },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    services: [ServiceItemSchema],
    faqs: [FaqSchema],
    requirements: [RequirementSchema],
    images: [{ type: String }],
    videoUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    freelancer: FreelancerSchema,
  },
  { timestamps: true },
);

GigSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Gig', GigSchema);
