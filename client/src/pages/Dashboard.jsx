import React from 'react';
import { Users, UserCheck, Calendar, Bed, AlertCircle, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function Dashboard({
  stats,
  patients = [],
  appointments = [],
  onOpenPatientModal,
  onOpenAppointmentModal,
  onUpdateAppointmentStatus,
  onViewAllPatients,
  onViewAllAppointments,
}) {
  const recentPatients = patients.slice(0, 5);
  const todayAppointments = appointments.slice(0, 5);

  const bedOccupancyPercent = stats?.totalBeds
    ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100)
    : 10;

  return (
    <div className="page-content">
      {/* Stat Cards Row */}
      <div className="stats-grid">
        <StatCard
          label="Total Registered Patients"
          value={stats?.totalPatients ?? patients.length}
          subtext={`${stats?.inpatients || 0} currently admitted`}
          icon={Users}
          accentColor="var(--accent-cyan)"
        />
        <StatCard
          label="On-Duty Medical Staff"
          value={stats?.activeDoctors ?? 0}
          subtext="Specialists across 6 departments"
          icon={UserCheck}
          accentColor="var(--accent-emerald)"
        />
        <StatCard
          label="Appointments in Queue"
          value={stats?.scheduledAppointments ?? 0}
          subtext="Scheduled for today & tomorrow"
          icon={Calendar}
          accentColor="var(--accent-teal)"
        />
        <StatCard
          label="Bed Availability"
          value={`${stats?.availableBeds ?? 46} / ${stats?.totalBeds ?? 50}`}
          subtext={`${bedOccupancyPercent}% occupancy rate`}
          icon={Bed}
          accentColor="var(--accent-amber)"
        />
      </div>

      {/* Bed Occupancy Progress Bar */}
      <div className="panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bed size={18} color="var(--accent-amber)" />
            <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Hospital Bed Occupancy Capacity</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>{stats?.occupiedBeds ?? 4}</strong> of {stats?.totalBeds ?? 50} Beds Occupied ({bedOccupancyPercent}%)
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${bedOccupancyPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 80%, #f43f5e 100%)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Two-Column Grid: Recent Patients & Upcoming Appointments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
        {/* Recent Patients Panel */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Users size={18} color="var(--accent-cyan)" />
              <span>Recent Patient Admissions</span>
            </div>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={onViewAllPatients}>
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Diagnosis</th>
                  <th>Status</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {p.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div className="user-info">
                          <div className="name">{p.name}</div>
                          <div className="meta">{p.gender}, {p.age} yrs • {p.bloodGroup}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ color: '#fff', fontWeight: 500 }}>{p.diagnosis}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.department}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {p.roomNumber}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentPatients.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No patients recorded yet. Click "Register Patient" above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments Panel */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Calendar size={18} color="var(--accent-teal)" />
              <span>Appointments Schedule</span>
            </div>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={onViewAllAppointments}>
              <span>View All</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient & Doctor</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{a.patientName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                        {a.doctorName} • {a.department}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: '#fff', fontWeight: 500 }}>{a.timeSlot}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.date}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${a.status === 'Completed' ? 'available' : a.status === 'Cancelled' ? 'critical' : 'inpatient'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>
                      {a.status === 'Scheduled' && (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="icon-btn"
                            title="Mark Completed"
                            onClick={() => onUpdateAppointmentStatus(a._id, 'Completed')}
                          >
                            <CheckCircle2 size={16} color="var(--accent-emerald)" />
                          </button>
                          <button
                            className="icon-btn"
                            title="Cancel Appointment"
                            onClick={() => onUpdateAppointmentStatus(a._id, 'Cancelled')}
                          >
                            <XCircle size={16} color="var(--accent-rose)" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {todayAppointments.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No appointments scheduled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
