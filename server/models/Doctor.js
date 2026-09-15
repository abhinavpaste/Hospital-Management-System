const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    department: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    availableDays: [{ type: String }],
    consultingHours: { type: String, default: '09:00 AM - 05:00 PM' },
    status: {
      type: String,
      enum: ['Available', 'On Duty', 'In Surgery', 'On Leave'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
