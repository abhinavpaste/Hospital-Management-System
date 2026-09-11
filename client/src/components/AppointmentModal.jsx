import React, { useState } from 'react';
import { X, CalendarPlus, Clock } from 'lucide-react';

export default function AppointmentModal({ isOpen, onClose, onAppointmentScheduled, doctors = [] }) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorName: doctors[0]?.name || 'Dr. Emily Watson',
    department: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    type: 'General Checkup',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctorName') {
      const doc = doctors.find((d) => d.name === value);
      setFormData((prev) => ({
        ...prev,
        doctorName: value,
        department: doc ? doc.department : prev.department,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        onAppointmentScheduled(data.data);
        onClose();
      } else {
        alert(data.message || 'Failed to schedule appointment');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: 'var(--accent-teal)' }}>
              <CalendarPlus size={22} />
            </div>
            <h2>Schedule Clinical Appointment</h2>
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
                  name="patientName"
                  className="form-control"
                  placeholder="e.g. Michael Scott"
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Patient Contact Phone *</label>
                <input
                  type="tel"
                  name="patientPhone"
                  className="form-control"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={formData.patientPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Consulting Doctor *</label>
                <select name="doctorName" className="form-control" value={formData.doctorName} onChange={handleChange}>
                  {doctors.map((d) => (
                    <option key={d._id} value={d.name}>
                      {d.name} ({d.specialization})
                    </option>
                  ))}
                  {doctors.length === 0 && <option value="Dr. Emily Watson">Dr. Emily Watson</option>}
                </select>
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  readOnly
                  value={formData.department}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Appointment Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  required
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Time Slot *</label>
                <select name="timeSlot" className="form-control" value={formData.timeSlot} onChange={handleChange}>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Appointment Category</label>
              <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                <option value="General Checkup">General Checkup</option>
                <option value="Follow-up">Follow-up Consultation</option>
                <option value="Routine">Routine Health Screening</option>
                <option value="Emergency">Urgent Referral</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reason / Clinical Notes</label>
              <textarea
                name="notes"
                className="form-control"
                rows="3"
                placeholder="Mention chief complaints, previous prescriptions, etc."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <CalendarPlus size={16} />
              <span>{submitting ? 'Booking...' : 'Confirm Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
