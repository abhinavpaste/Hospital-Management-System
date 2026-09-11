import React, { useState } from 'react';
import { X, UserPlus, HeartPulse } from 'lucide-react';

export default function PatientModal({ isOpen, onClose, onPatientAdded, doctors = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    diagnosis: '',
    department: 'General Medicine',
    doctorAssigned: doctors[0]?.name || 'Dr. Emily Watson',
    status: 'Outpatient',
    roomNumber: 'N/A',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        onPatientAdded(data.data);
        onClose();
      } else {
        alert(data.message || 'Failed to add patient');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting patient form');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: 'var(--accent-cyan)' }}>
              <HeartPulse size={22} />
            </div>
            <h2>Register New Patient</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Patient Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Sarah Jenkins"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  className="form-control"
                  placeholder="e.g. 34"
                  min="0"
                  max="120"
                  required
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Blood Group *</label>
                <select name="bloodGroup" className="form-control" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Contact *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Primary Diagnosis / Symptoms *</label>
              <input
                type="text"
                name="diagnosis"
                className="form-control"
                placeholder="e.g. Chest Pain, Arrhythmia"
                required
                value={formData.diagnosis}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <select name="department" className="form-control" value={formData.department} onChange={handleChange}>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="General Surgery">General Surgery</option>
                </select>
              </div>

              <div className="form-group">
                <label>Admission Status</label>
                <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                  <option value="Outpatient">Outpatient</option>
                  <option value="Inpatient">Inpatient (Admitted)</option>
                  <option value="Critical">Critical (ICU)</option>
                </select>
              </div>
            </div>

            {formData.status !== 'Outpatient' && (
              <div className="form-group">
                <label>Assigned Bed / Ward</label>
                <input
                  type="text"
                  name="roomNumber"
                  className="form-control"
                  placeholder="e.g. Ward 204A or ICU-01"
                  value={formData.roomNumber}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <UserPlus size={16} />
              <span>{submitting ? 'Registering...' : 'Register Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
