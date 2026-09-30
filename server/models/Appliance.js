const mongoose = require('mongoose');

const applianceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide appliance name'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'Wrench'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appliance', applianceSchema);
