import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'Placed' },
    amount: { type: Number, required: true },
    deliveryDays: { type: Number, required: true },
    paymentStatus: { type: String, default: 'Pending' },
  },
  { timestamps: true },
);

export default mongoose.model('Order', OrderSchema);
