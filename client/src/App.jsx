import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import PatientModal from './components/PatientModal';
import AppointmentModal from './components/AppointmentModal';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, patientsRes, doctorsRes, aptsRes] = await Promise.all([
        fetch('/api/stats').then((r) => r.json()),
        fetch('/api/patients').then((r) => r.json()),
        fetch('/api/doctors').then((r) => r.json()),
        fetch('/api/appointments').then((r) => r.json()),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (patientsRes.success) setPatients(patientsRes.data);
      if (doctorsRes.success) setDoctors(doctorsRes.data);
      if (aptsRes.success) setAppointments(aptsRes.data);
    } catch (err) {
      console.error('Failed to load API data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handlePatientAdded = (newPatient) => {
    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Patient "${newPatient.name}" registered successfully!`);
    fetchData();
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;
    try {
      const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPatients((prev) => prev.filter((p) => p._id !== id));
        showToast('Patient record deleted');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePatientStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setPatients((prev) => prev.map((p) => (p._id === id ? { ...p, status } : p)));
        showToast('Patient status updated');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAppointmentScheduled = (newApt) => {
    setAppointments((prev) => [newApt, ...prev]);
    showToast(`Appointment booked for ${newApt.patientName}`);
    fetchData();
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status } : a))
        );
        showToast(`Appointment marked as ${status}`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments((prev) => prev.filter((a) => a._id !== id));
        showToast('Appointment removed');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateDoctorStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/doctors/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setDoctors((prev) => prev.map((d) => (d._id === id ? { ...d, status } : d)));
        showToast('Doctor status updated');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          scheduledAppointments: appointments.filter((a) => a.status === 'Scheduled').length,
        }}
        dbStatus={stats?.dbStatus}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          activeTab={activeTab}
          onOpenPatientModal={() => setIsPatientModalOpen(true)}
          onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
        />

        {loading && (
          <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--accent-cyan)' }}>
            <Loader2 size={24} className="spin" />
            <span>Loading hospital data...</span>
          </div>
        )}

        {!loading && activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            patients={patients}
            appointments={appointments}
            onOpenPatientModal={() => setIsPatientModalOpen(true)}
            onOpenAppointmentModal={() => setIsAppointmentModalOpen(true)}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onViewAllPatients={() => setActiveTab('patients')}
            onViewAllAppointments={() => setActiveTab('appointments')}
          />
        )}

        {!loading && activeTab === 'patients' && (
          <Patients
            patients={patients}
            onOpenModal={() => setIsPatientModalOpen(true)}
            onDeletePatient={handleDeletePatient}
            onUpdatePatientStatus={handleUpdatePatientStatus}
          />
        )}

        {!loading && activeTab === 'doctors' && (
          <Doctors
            doctors={doctors}
            onUpdateDoctorStatus={handleUpdateDoctorStatus}
          />
        )}

        {!loading && activeTab === 'appointments' && (
          <Appointments
            appointments={appointments}
            onOpenModal={() => setIsAppointmentModalOpen(true)}
            onUpdateStatus={handleUpdateAppointmentStatus}
            onDeleteAppointment={handleDeleteAppointment}
          />
        )}
      </div>

      {/* Modals */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onPatientAdded={handlePatientAdded}
        doctors={doctors}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onAppointmentScheduled={handleAppointmentScheduled}
        doctors={doctors}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={18} color="var(--accent-emerald)" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
