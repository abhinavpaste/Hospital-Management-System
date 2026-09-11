import React from 'react';
import { UserPlus, CalendarPlus } from 'lucide-react';

export default function Navbar({ activeTab, onOpenPatientModal, onOpenAppointmentModal }) {
  const getHeaderDetails = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Hospital Clinical Operations Overview',
          subtitle: 'Real-time patient census, on-duty clinical staff, and appointment throughput',
        };
      case 'patients':
        return {
          title: 'Patients Management & Census',
          subtitle: 'Active admissions, outpatient records, and department allocations',
        };
      case 'doctors':
        return {
          title: 'Medical Staff & Specialists Directory',
          subtitle: 'Physician duty schedules, clinical specialties, and availability',
        };
      case 'appointments':
        return {
          title: 'Outpatient & Clinical Appointments',
          subtitle: 'Daily consultations queue, diagnostics, and patient schedules',
        };
      default:
        return { title: 'Hospital Management System', subtitle: 'Clinical Operations' };
    }
  };

  const details = getHeaderDetails();

  return (
    <header className="top-header">
      <div className="header-title-group">
        <h1>{details.title}</h1>
        <p>{details.subtitle}</p>
      </div>

      <div className="header-actions">
        <button className="btn-secondary" onClick={onOpenAppointmentModal}>
          <CalendarPlus size={16} color="var(--accent-teal)" />
          <span>Book Appointment</span>
        </button>
        <button className="btn-primary" onClick={onOpenPatientModal}>
          <UserPlus size={16} />
          <span>New Patient</span>
        </button>
      </div>
    </header>
  );
}
