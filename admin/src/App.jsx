import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';

import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';

import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  const isAuthenticated = dToken || aToken;

  return (
    <>
      <ToastContainer />
      {isAuthenticated ? (
        <div className='bg-[#F8F9FD]'>
          <Navbar />
          <div className='flex items-start'>
            <Sidebar />
            <Routes>
              <Route
                path="/"
                element={
                  aToken ? <Navigate to="/admin-dashboard" /> :
                  dToken ? <Navigate to="/doctor-dashboard" /> :
                  <Navigate to="/login" />
                }
              />
              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={aToken ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/all-appointments" element={aToken ? <AllAppointments /> : <Navigate to="/login" />} />
              <Route path="/add-doctor" element={aToken ? <AddDoctor /> : <Navigate to="/login" />} />
              <Route path="/doctor-list" element={aToken ? <DoctorsList /> : <Navigate to="/login" />} />

              {/* Doctor Routes */}
              <Route path="/doctor-dashboard" element={dToken ? <DoctorDashboard /> : <Navigate to="/login" />} />
              <Route path="/doctor-appointments" element={dToken ? <DoctorAppointments /> : <Navigate to="/login" />} />
              <Route path="/doctor-profile" element={dToken ? <DoctorProfile /> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </>
  );
};

export default App;
