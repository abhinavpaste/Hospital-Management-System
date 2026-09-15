import React, { useState } from 'react';
import { Calendar, Search, CalendarPlus, CheckCircle2, XCircle, Trash2, Clock, User } from 'lucide-react';

export default function Appointments({
  appointments = [],
  onOpenModal,
  onUpdateStatus,
  onDeleteAppointment,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientPhone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-content">
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Calendar size={20} color="var(--accent-teal)" />
            <span>Clinical Appointments & Scheduling ({filteredAppointments.length})</span>
          </div>

          <div className="panel-actions">
            <div className="search-box">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="search-input"
                placeholder="Search patient, doctor, dept..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button className="btn-primary" onClick={onOpenModal}>
              <CalendarPlus size={16} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor & Dept</th>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Clinical Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{apt.patientName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{apt.patientPhone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{apt.doctorName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{apt.department}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{apt.timeSlot}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{apt.date}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {apt.type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {apt.notes || '—'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${
                        apt.status === 'Completed'
                          ? 'available'
                          : apt.status === 'Cancelled'
                          ? 'critical'
                          : 'inpatient'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {apt.status === 'Scheduled' && (
                        <>
                          <button
                            className="icon-btn"
                            title="Mark Completed"
                            onClick={() => onUpdateStatus(apt._id, 'Completed')}
                          >
                            <CheckCircle2 size={16} color="var(--accent-emerald)" />
                          </button>
                          <button
                            className="icon-btn"
                            title="Cancel Appointment"
                            onClick={() => onUpdateStatus(apt._id, 'Cancelled')}
                          >
                            <XCircle size={16} color="var(--accent-rose)" />
                          </button>
                        </>
                      )}
                      <button
                        className="icon-btn delete"
                        title="Delete Entry"
                        onClick={() => onDeleteAppointment(apt._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No appointments found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
