const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { isDbConnected } = require('../config/db');
let { doctors } = require('../data/mockData');

// GET all doctors
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbDoctors = await Doctor.find();
      return res.json({ success: true, source: 'mongodb', count: dbDoctors.length, data: dbDoctors });
    }
    return res.json({ success: true, source: 'in-memory', count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new doctor
router.post('/', async (req, res) => {
  try {
    const { name, specialization, department, experienceYears, phone, email, availableDays, consultingHours, status } = req.body;

    if (!name || !specialization || !department || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Missing required doctor fields' });
    }

    if (isDbConnected()) {
      const newDoc = new Doctor(req.body);
      const saved = await newDoc.save();
      return res.status(201).json({ success: true, source: 'mongodb', data: saved });
    }

    const newDoc = {
      _id: 'd_' + Date.now(),
      name,
      specialization,
      department,
      experienceYears: Number(experienceYears) || 1,
      phone,
      email,
      availableDays: availableDays || ['Mon', 'Wed', 'Fri'],
      consultingHours: consultingHours || '09:00 AM - 05:00 PM',
      status: status || 'Available',
      createdAt: new Date().toISOString(),
    };

    doctors.push(newDoc);
    return res.status(201).json({ success: true, source: 'in-memory', data: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (isDbConnected()) {
      const updated = await Doctor.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Doctor not found' });
      return res.json({ success: true, data: updated });
    }

    const doc = doctors.find((d) => d._id === req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Doctor not found' });
    doc.status = status;
    return res.json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
