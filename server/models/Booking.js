const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must have a customer']
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    appliance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appliance',
      required: [true, 'Booking must have an appliance']
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Booking must have a service']
    },
    problemDescription: {
      type: String,
      required: [true, 'Please provide problem description'],
      trim: true
    },
    preferredDate: {
      type: String,
      required: [true, 'Please specify preferred date']
    },
    preferredTime: {
      type: String,
      required: [true, 'Please specify preferred time']
    },
    address: {
      type: String,
      required: [true, 'Please provide service address'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'Accepted', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    serviceNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
