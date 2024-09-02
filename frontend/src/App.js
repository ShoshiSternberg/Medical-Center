import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import AdminPage from './components/AdminPage/AdminPage';
import RoomsPage from './components/AdminPage/RoomsPage';
import HomePage from './components/HomePage/HomePage';
import UsersControl from './components/AdminPage/usersControl/usersControl';
import PagesNavigation from './components/HomePage/pagesNavigate/pagesNavigate';
import PatientEnter from './components/PatientEnter/PatientEnter';
import DoctorPage from './components/DoctorPage/DoctorPage';
import MessagePage from './components/Messages/MessagePage';
import MonitorPage from './components/MonitorPage/MonitorPage';

import QueueManagmentPage from './components/QueuesManagment/QueuesManagmentPage';
import logo from './logo.png';

import Login from './components/AdminPage/usersControl/Login';

import './App.css';
import ConfirmPassword from './components/AdminPage/usersControl/checkPassword';
import NewPassword from './components/AdminPage/usersControl/newPassword';
import ReportsPage from './components/ReportsPage/ReportsPage'
function App() {
  return (
    <Router>
      <div className="App">
        {/* <Logo /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pagesNavigate" element={<PagesNavigation />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/userLogin" element={<Login />} />
          <Route path="/users" element={<UsersControl />} />
          <Route path="/patientEnter" element={<PatientEnter />} />
          <Route path="/doctorPage/:id" element={<DoctorPage />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />

          <Route path="/QueueManagment" element={<QueueManagmentPage />} />
          <Route path="/checkPassword" element={<ConfirmPassword />} />
          <Route path="/newPassword" element={<NewPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

//to move it to separate page?
function Logo() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className='logoContainer' onClick={handleLogoClick} >
      <img src={logo} alt='logo' className='logoImg' />
    </div>
  );
}

export default App;