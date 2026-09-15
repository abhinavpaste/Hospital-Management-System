const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { isDbConnected } = require('../config/db');
let { patients } = require('../data/mockData');

// GET all patients
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbPatients = await Patient.find().sort({ createdAt: -1 });
      return res.json({ success: true, source: 'mongodb', count: dbPatients.length, data: dbPatients });
    }
    return res.json({ success: true, source: 'in-memory', count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single patient
router.get('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const patient = await Patient.findById(req.params.id);
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.json({ success: true, data: patient });
    }
    const patient = patients.find((p) => p._id === req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    return res.json({ success: true, data: patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new patient
router.post('/', async (req, res) => {
  try {
    const { name, age, gender, bloodGroup, phone, email, address, diagnosis, department, doctorAssigned, status, roomNumber } = req.body;

    if (!name || !age || !gender || !bloodGroup || !phone || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    if (isDbConnected()) {
      const newPatient = new Patient(req.body);
      const saved = await newPatient.save();
      return res.status(201).json({ success: true, source: 'mongodb', data: saved });
    }

    const newPatient = {
      _id: 'p_' + Date.now(),
      name,
      age: Number(age),
      gender,
      bloodGroup,
      phone,
      email: email || '',
      address: address || '',
      diagnosis,
      department: department || 'General Medicine',
      doctorAssigned: doctorAssigned || 'Unassigned',
      status: status || 'Outpatient',
      roomNumber: roomNumber || 'N/A',
      createdAt: new Date().toISOString(),
    };

    patients.unshift(newPatient);
    return res.status(201).json({ success: true, source: 'in-memory', data: newPatient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update patient
router.put('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.json({ success: true, data: updated });
    }

    const index = patients.findIndex((p) => p._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Patient not found' });

    patients[index] = { ...patients[index], ...req.body };
    return res.json({ success: true, data: patients[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE patient
router.delete('/:id', async (req, res) => {
  try {
    if (isDbConnected()) {
      const deleted = await Patient.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.json({ success: true, message: 'Patient deleted successfully' });
    }

    const index = patients.findIndex((p) => p._id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Patient not found' });

    patients.splice(index, 1);
    return res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
