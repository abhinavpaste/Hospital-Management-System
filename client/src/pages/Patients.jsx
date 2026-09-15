import React, { useState } from 'react';
import { Users, Search, Filter, Trash2, UserPlus, Phone, Mail, MapPin } from 'lucide-react';

export default function Patients({ patients = [], onOpenModal, onDeletePatient, onUpdatePatientStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-content">
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <Users size={20} color="var(--accent-cyan)" />
            <span>Patients Directory ({filteredPatients.length})</span>
          </div>

          <div className="panel-actions">
            <div className="search-box">
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="search-input"
                placeholder="Search name, symptom, dept..."
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
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatient">Outpatient</option>
              <option value="Critical">Critical (ICU)</option>
              <option value="Discharged">Discharged</option>
            </select>

            <button className="btn-primary" onClick={onOpenModal}>
              <UserPlus size={16} />
              <span>New Patient</span>
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Contact</th>
                <th>Diagnosis & Department</th>
                <th>Assigned Doctor</th>
                <th>Status</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {p.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="user-info">
                        <div className="name">{p.name}</div>
                        <div className="meta">
                          {p.gender}, {p.age} yrs • <strong style={{ color: 'var(--accent-cyan)' }}>{p.bloodGroup}</strong>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#fff' }}>
                      <Phone size={12} color="var(--text-muted)" />
                      <span>{p.phone}</span>
                    </div>
                    {p.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <Mail size={12} />
                        <span>{p.email}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{p.diagnosis}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.department}</div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--accent-teal)', fontWeight: 500 }}>{p.doctorAssigned}</div>
                  </td>
                  <td>
                    <select
                      className="filter-select"
                      style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                      value={p.status}
                      onChange={(e) => onUpdatePatientStatus(p._id, e.target.value)}
                    >
                      <option value="Outpatient">Outpatient</option>
                      <option value="Inpatient">Inpatient</option>
                      <option value="Critical">Critical</option>
                      <option value="Discharged">Discharged</option>
                    </select>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#fff' }}>
                      {p.roomNumber || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-btn delete"
                      title="Delete Record"
                      onClick={() => onDeletePatient(p._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No patients match your search or filter criteria.
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
