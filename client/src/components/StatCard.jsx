import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, accentColor }) {
  return (
    <div className="stat-card" style={{ '--card-accent': accentColor }}>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon-wrapper">
          {Icon && <Icon size={20} />}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
  );
}
