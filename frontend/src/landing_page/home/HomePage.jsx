import React from 'react';
import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import Pricing from './Pricing.jsx';
import Education from './Education.jsx';

import OpenAccount from '../OpenAccount.jsx';
import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';


function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Pricing />
      <Education />
      <OpenAccount />
      <Footer />
    </>
  );
}

export default HomePage;