import React from 'react';
import { Activity, Users, UserCheck, Calendar, ShieldCheck, Database, Layers } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts, dbStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: null },
    { id: 'patients', label: 'Patients', icon: Users, badge: counts?.totalPatients || 0 },
    { id: 'doctors', label: 'Medical Staff', icon: UserCheck, badge: counts?.totalDoctors || 0 },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: counts?.scheduledAppointments || 0 },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <Activity size={22} />
        </div>
        <div>
          <div className="brand-title">PulseCare</div>
          <div className="brand-subtitle">Clinical Ops</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge !== null && item.badge > 0 && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="db-pill">
          <span className={`pulse-indicator ${dbStatus?.connected ? 'active' : 'fallback'}`}></span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.78rem' }}>
              {dbStatus?.connected ? 'MongoDB Connected' : 'In-Memory Mode'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {dbStatus?.type || 'Local Persistence'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
