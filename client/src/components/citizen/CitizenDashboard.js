import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CitizenSidebar from './CitizenSidebar';
import CitizenHome from './CitizenHome';
import SubmitComplaint from './SubmitComplaint';
import MyComplaints from './MyComplaints';
import Profile from './Profile';

const CitizenDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
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
  );
};

export default CitizenDashboard;
