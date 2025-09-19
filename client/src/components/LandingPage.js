import React from 'react';
import Navbar from './shared/Navbar';
import Hero from './shared/Hero';
import Features from './shared/Features';
import HowItWorks from './shared/HowItWorks';
import Footer from './shared/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default LandingPage;
