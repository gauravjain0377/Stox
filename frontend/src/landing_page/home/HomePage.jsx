import React from 'react';
import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import TrustedInvestors from './TrustedInvestors.jsx';
import SmartPortfolio from './SmartPortfolio.jsx';
import Testimonials from './Testimonials.jsx';
import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <SmartPortfolio />
      <TrustedInvestors />
      <Testimonials />
      <Footer />
    </>
  );
}

export default HomePage;