import React from 'react';
import Hero from './Hero.jsx';
import Stats from './Stats.jsx';
import TrustedInvestors from './TrustedInvestors.jsx';
import SmartPortfolio from './SmartPortfolio.jsx';
import Testimonials from './Testimonials.jsx';
import CallToAction from './CallToAction.jsx';
import Navbar from '../Navbar.jsx';
import Footer from '../Footer.jsx';

function HomePage() {
  return (
    <div style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <Navbar />
      
      <section style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        <Hero />
      </section>

      <section style={{ paddingTop: '0px', paddingBottom: '30px' }}>
        <Stats />
      </section>

      <section style={{  paddingBottom: '30px' }}>
        <SmartPortfolio />
      </section>

      <section style={{ paddingTop: '80px', paddingBottom: '30px' }}>
        <TrustedInvestors />
      </section>

      <section style={{ paddingTop: '80px', paddingBottom: '50px' }}>
        <Testimonials />
        </section>

      <section style={{ paddingTop: '80px', paddingBottom: '50px' }}>
      <CallToAction />
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
