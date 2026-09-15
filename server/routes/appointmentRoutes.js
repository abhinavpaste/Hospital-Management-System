const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { isDbConnected } = require('../config/db');
let { appointments } = require('../data/mockData');

// GET all appointments
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbAppointments = await Appointment.find().sort({ date: 1, timeSlot: 1 });
      return res.json({ success: true, source: 'mongodb', count: dbAppointments.length, data: dbAppointments });
    }
    return res.json({ success: true, source: 'in-memory', count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new appointment
router.post('/', async (req, res) => {
  try {
    const { patientName, patientPhone, doctorName, department, date, timeSlot, type, notes } = req.body;

    if (!patientName || !patientPhone || !doctorName || !date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Missing required appointment fields' });
    }

    if (isDbConnected()) {
      const newApt = new Appointment(req.body);
      const saved = await newApt.save();
      return res.status(201).json({ success: true, source: 'mongodb', data: saved });
    }

    const newApt = {
      _id: 'a_' + Date.now(),
      patientName,
      patientPhone,
      doctorName,
      department: department || 'General Medicine',
      date,
      timeSlot,
      type: type || 'General Checkup',
      status: 'Scheduled',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    appointments.unshift(newApt);
    return res.status(201).json({ success: true, source: 'in-memory', data: newApt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (isDbConnected()) {
      const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Appointment not found' });
      return res.json({ success: true, data: updated });
    }

    const apt = appointments.find((a) => a._id === req.params.id);
    if (!apt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    apt.status = status;
    return res.json({ success: true, data: apt });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await Appointment.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Appointment not found' });
      return res.json({ success: true, message: 'Appointment deleted successfully' });
    }

    const index = appointments.findIndex((a) => a._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Appointment not found' });
    appointments.splice(index, 1);
    return res.json({ success: true, message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
