const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  seller: {
    required: [true, 'A subscription plan must have a seller'],
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
 },
  interval: {
    type: String,
    required: [true, 'A subscription plan must have an interval'],
    enum: {
      values: ['weekly', 'monthly', 'quarterly', 'annually'],
      message: 'Interval must be weekly, monthly, quarterly, or annually',
    },
  },
  amount: {
    type: Number,
    required: [true, 'A subscription plan must have an amount'],
    min: [0, 'Amount must be positive'],
  },
  currency: {
    type: String,
    required: [true, 'A subscription plan must have a currency'],
    enum: {
      values: ['ETB', 'USD'],
      message: 'Currency must be ETB or USD',
    },
    default: 'ETB',
  },
  tx_ref:[ {
    type: String,
    required: [true, 'A subscription plan must have a transaction reference'],
    unique: [true, 'Transaction reference must be unique'],
  }],
  frequency:{
    type:Number,
    default:1
  },
  paymentDate:[
    {
      type: Date,
      default: Date.now,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

subscriptionPlanSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'seller',
    select: '_id name email role '
  });
  next();
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan;
