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
    <div style={{ background: '#FAFAFA', minHeight: '100vh', width: '100%', overflowX: 'hidden', position: 'relative', boxSizing: 'border-box' }}>
      <Navbar />
      
      <section style={{ paddingTop: '0px', paddingBottom: '0px', width: '100%', boxSizing: 'border-box' }}>
        <Hero />
      </section>

      <section style={{ paddingTop: 'clamp(20px, 4vw, 40px)', paddingBottom: 'clamp(20px, 3vw, 30px)', width: '100%', boxSizing: 'border-box' }}>
        <Stats />
      </section>

      <section style={{ paddingTop: 'clamp(20px, 4vw, 40px)', paddingBottom: 'clamp(20px, 3vw, 30px)', width: '100%', boxSizing: 'border-box' }}>
        <SmartPortfolio />
      </section>

      <section style={{ paddingTop: 'clamp(40px, 6vw, 80px)', paddingBottom: 'clamp(20px, 3vw, 30px)', width: '100%', boxSizing: 'border-box' }}>
        <TrustedInvestors />
      </section>

      <section style={{ paddingTop: 'clamp(40px, 6vw, 80px)', paddingBottom: 'clamp(30px, 4vw, 50px)', width: '100%', boxSizing: 'border-box' }}>
        <Testimonials />
      </section>

      <section style={{ paddingTop: 'clamp(40px, 6vw, 80px)', paddingBottom: 'clamp(30px, 4vw, 50px)', width: '100%', boxSizing: 'border-box' }}>
        <CallToAction />
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
