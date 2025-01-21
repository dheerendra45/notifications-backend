const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    type: { type: String, enum: ['Virtual', 'Hybrid'], required: true },
    maxCapacity: { type: Number, required: true },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // This references the User model
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Event', EventSchema);
