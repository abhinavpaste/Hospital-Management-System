import React from 'react';
import { UserCheck, Clock, Calendar, Mail, Phone, Award } from 'lucide-react';

export default function Doctors({ doctors = [], onUpdateDoctorStatus }) {
  return (
    <div className="page-content">
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">
            <UserCheck size={20} color="var(--accent-emerald)" />
            <span>Hospital Medical Staff & Specialists ({doctors.length})</span>
          </div>
        </div>

        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {doctors.map((doc) => {
            const isAvailable = doc.status === 'Available' || doc.status === 'On Duty';
            return (
              <div
                key={doc._id}
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      {doc.name.replace('Dr. ', '').split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{doc.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 500 }}>
                        {doc.specialization}
                      </p>
                    </div>
                  </div>

                  <select
                    className="filter-select"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                    value={doc.status}
                    onChange={(e) => onUpdateDoctorStatus(doc._id, e.target.value)}
                  >
                    <option value="Available">Available</option>
                    <option value="On Duty">On Duty</option>
                    <option value="In Surgery">In Surgery</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={14} color="var(--accent-amber)" />
                    <span>{doc.department} Department • {doc.experienceYears} Years Exp.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color="var(--text-muted)" />
                    <span>{doc.consultingHours}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="var(--text-muted)" />
                    <span>{doc.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="var(--text-muted)" />
                    <span>{doc.email}</span>
                  </div>
                </div>

                {doc.availableDays && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {doc.availableDays.map((day) => (
                      <span
                        key={day}
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
