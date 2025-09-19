import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import CitizenSidebar from './CitizenSidebar';
import CitizenHome from './CitizenHome';
import SubmitComplaint from './SubmitComplaint';
import MyComplaints from './MyComplaints';
import Profile from './Profile';

const CitizenDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="flex pt-16">
        <CitizenSidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<CitizenHome />} />
            <Route path="/submit" element={<SubmitComplaint />} />
            <Route path="/complaints" element={<MyComplaints />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default CitizenDashboard;
