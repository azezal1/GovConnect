import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GovernmentSidebar from './GovernmentSidebar';
import GovernmentHome from './GovernmentHome';
import AllComplaints from './AllComplaints';
import ComplaintsMap from './ComplaintsMap';
import Analytics from './Analytics';
import Profile from './Profile';

const GovernmentDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <GovernmentSidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<GovernmentHome />} />
          <Route path="/complaints" element={<AllComplaints />} />
          <Route path="/map" element={<ComplaintsMap />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default GovernmentDashboard;
