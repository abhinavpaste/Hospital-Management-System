const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { isDbConnected } = require('../config/db');
const { patients, doctors, appointments } = require('../data/mockData');

router.get('/', async (req, res) => {
  try {
    const mongoActive = isDbConnected();

    let patientList = patients;
    let doctorList = doctors;
    let appointmentList = appointments;

    if (mongoActive) {
      patientList = await Patient.find();
      doctorList = await Doctor.find();
      appointmentList = await Appointment.find();
    }

    const totalPatients = patientList.length;
    const inpatients = patientList.filter((p) => p.status === 'Inpatient' || p.status === 'Critical').length;
    const totalDoctors = doctorList.length;
    const activeDoctors = doctorList.filter((d) => d.status === 'Available' || d.status === 'On Duty').length;
    const scheduledAppointments = appointmentList.filter((a) => a.status === 'Scheduled').length;
    const totalAppointments = appointmentList.length;

    // Available beds (out of 50 total capacity)
    const totalBeds = 50;
    const occupiedBeds = inpatients;
    const availableBeds = Math.max(0, totalBeds - occupiedBeds);

    return res.json({
      success: true,
      data: {
        totalPatients,
        inpatients,
        totalDoctors,
        activeDoctors,
        totalAppointments,
        scheduledAppointments,
        totalBeds,
        occupiedBeds,
        availableBeds,
        dbStatus: {
          connected: mongoActive,
          type: mongoActive ? 'MongoDB Atlas / Local' : 'In-Memory Mock Fallback',
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
