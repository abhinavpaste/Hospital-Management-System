const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    bloodGroup: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    diagnosis: { type: String, required: true },
    department: { type: String, default: 'General Medicine' },
    doctorAssigned: { type: String, default: 'Unassigned' },
    status: {
      type: String,
      enum: ['Inpatient', 'Outpatient', 'Discharged', 'Critical'],
      default: 'Outpatient',
    },
    roomNumber: { type: String, default: 'N/A' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
