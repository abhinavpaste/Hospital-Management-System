const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    doctorName: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, required: true },
    type: {
      type: String,
      enum: ['General Checkup', 'Follow-up', 'Emergency', 'Routine'],
      default: 'General Checkup',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'In Progress'],
      default: 'Scheduled',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
