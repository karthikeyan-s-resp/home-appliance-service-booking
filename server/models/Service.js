const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    appliance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appliance',
      required: [true, 'Service must belong to an appliance']
    },
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Please specify price'],
      min: 0
    },
    estimatedDuration: {
      type: String,
      default: '1-2 hours'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
