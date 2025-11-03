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
    <div style={{ background: '#FAFAFA', minHeight: '100vh', width: '100%', overflowX: 'hidden', position: 'relative' }}>
      <Navbar />
      
      <section style={{ paddingTop: '0px', paddingBottom: '0px', width: '100%' }}>
        <Hero />
      </section>

      <section style={{ paddingTop: '0px', paddingBottom: 'clamp(20px, 3vw, 30px)', width: '100%' }}>
        <Stats />
      </section>

      <section style={{ paddingBottom: 'clamp(20px, 3vw, 30px)', width: '100%' }}>
        <SmartPortfolio />
      </section>

      <section style={{ paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(20px, 3vw, 30px)', width: '100%' }}>
        <TrustedInvestors />
      </section>

      <section style={{ paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(30px, 5vw, 50px)', width: '100%' }}>
        <Testimonials />
        </section>

      <section style={{ paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: 'clamp(30px, 5vw, 50px)', width: '100%' }}>
      <CallToAction />
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
