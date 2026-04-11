import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    provider: { type: String, default: 'easypaisa' },
    status: { type: String, default: 'Initiated' },
    amount: { type: Number, required: true },
    reference: { type: String, required: true },
    redirectUrl: { type: String, default: '' },
    meta: { type: Object, default: {} },
  },
  { timestamps: true },
);

export default mongoose.model('Payment', PaymentSchema);
