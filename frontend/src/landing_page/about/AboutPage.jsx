import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Hero from "./Hero";
import { Shield, MapPin, Users } from "lucide-react";

function MissionValues() {
  return (
    <section style={{ background: '#184634', color: '#fff', padding: '5rem 0 4rem 0', minHeight: '60vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.2rem', color: '#fff', letterSpacing: '-0.02em' }}>
          Our Mission & Values
        </h2>
        <div style={{ fontSize: '1.35rem', color: '#e0e0e0', fontWeight: 400, marginBottom: '3.5rem', maxWidth: 600 }}>
          Built on principles that put Indian investors first.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'space-between' }}>
          {/* Card 1 */}
          <div style={{ flex: '1 1 300px', minWidth: 260, maxWidth: 370, background: 'transparent', borderRadius: 18, padding: '0 0 0 0' }}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 12, width: 48, height: 48 }}>
                <Shield color="#b7e4c7" size={32} strokeWidth={2.2} />
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: 8, color: '#fff' }}>Transparency First</div>
            <div style={{ color: '#e0e0e0', fontSize: '1.08rem', marginBottom: 18, fontWeight: 400 }}>
              Every fee, every process, every decision – completely open. No hidden charges, no surprise costs.
            </div>
            <a href="#transparency" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem', opacity: 0.93, display: 'inline-block', transition: 'opacity 0.2s' }}>Learn more <span style={{ fontSize: '1.2em', verticalAlign: 'middle' }}>&rarr;</span></a>
          </div>
          {/* Card 2 */}
          <div style={{ flex: '1 1 300px', minWidth: 260, maxWidth: 370, background: 'transparent', borderRadius: 18, padding: '0 0 0 0' }}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 12, width: 48, height: 48 }}>
                <MapPin color="#b7e4c7" size={32} strokeWidth={2.2} />
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: 8, color: '#fff' }}>Made for India</div>
            <div style={{ color: '#e0e0e0', fontSize: '1.08rem', marginBottom: 18, fontWeight: 400 }}>
              Designed specifically for Indian markets, regulations, and investor needs. Local expertise, global standards.
            </div>
            <a href="#made-for-india" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem', opacity: 0.93, display: 'inline-block', transition: 'opacity 0.2s' }}>Learn more <span style={{ fontSize: '1.2em', verticalAlign: 'middle' }}>&rarr;</span></a>
          </div>
          {/* Card 3 */}
          <div style={{ flex: '1 1 300px', minWidth: 260, maxWidth: 370, background: 'transparent', borderRadius: 18, padding: '0 0 0 0' }}>
            <div style={{ marginBottom: 18 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.07)', borderRadius: 12, width: 48, height: 48 }}>
                <Users color="#b7e4c7" size={32} strokeWidth={2.2} />
              </span>
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.18rem', marginBottom: 8, color: '#fff' }}>Community Driven</div>
            <div style={{ color: '#e0e0e0', fontSize: '1.08rem', marginBottom: 18, fontWeight: 400 }}>
              Your feedback shapes our roadmap. Direct access to the developer, constant improvements based on real user needs.
            </div>
            <a href="#community" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem', opacity: 0.93, display: 'inline-block', transition: 'opacity 0.2s' }}>Learn more <span style={{ fontSize: '1.2em', verticalAlign: 'middle' }}>&rarr;</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section style={{ background: '#fff', padding: '8rem 0 6rem 0', minHeight: '60vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '6rem', padding: '0 2rem' }}>
        {/* Left: Developer Photo + Dots */}
        <div style={{ flex: '1 1 340px', minWidth: 320, maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', marginTop: '2.5rem', marginBottom: '2.5rem', left: '-40px' }}>
          <div style={{
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 40%, #fffde4 70%, #fffbe6 100%)',
            boxShadow: '0 0 0 8px #e0f2ef, 0 8px 32px 0 rgba(0,127,127,0.10)',
            border: '4px solid #007f7f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#e9ecef', opacity: 0.7, position: 'absolute', left: 100, top: 100 }} />
            <div style={{ width: 180, height: 180, borderRadius: '50%', background: '#f8f9fa', opacity: 0.5, position: 'absolute', left: 70, top: 70 }} />
            {/* White circle behind the photo for a clean look */}
            <div style={{ width: 220, height: 220, borderRadius: '50%', background: '#fff', position: 'absolute', zIndex: 2 }} />
            <img src="/media/images/Gaurav_Jain.png" alt="Gaurav Jain" style={{ width: 220, height: 220, borderRadius: '50%', objectFit: 'cover', zIndex: 3, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }} />
          </div>
          {/* Decorative Dots */}
          {/* Top right yellow dot */}
          <span style={{ position: 'absolute', top: '-28px', right: '-28px', width: 28, height: 28, borderRadius: '50%', background: '#ffe066', opacity: 0.95, boxShadow: '0 2px 8px #fffbe6' }} />
          {/* Bottom left orange dot */}
          <span style={{ position: 'absolute', bottom: '-18px', left: '-18px', width: 18, height: 18, borderRadius: '50%', background: '#ffbe76', opacity: 0.95, boxShadow: '0 2px 8px #fffbe6' }} />
          {/* Zen and Social Links */}
          <div style={{ marginTop: 40, textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#184634', fontSize: '1.18rem', fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
              Playing cricket is his zen.
            </div>
            <div style={{ fontSize: '1.08rem', color: '#234b36', fontWeight: 400, letterSpacing: '0.01em', textAlign: 'center' }}>
              Connect on{' '}
              <a href="https://www.linkedin.com/in/this-is-gaurav-jain/" target="_blank" rel="noopener noreferrer" style={{ color: '#333', textDecoration: 'underline', fontWeight: 600, margin: '0 2px' }}>LinkedIn</a>
              <span style={{ color: '#bbb', fontWeight: 400, margin: '0 6px' }}>/</span>
              <a href="https://github.com/gauravjain0377" target="_blank" rel="noopener noreferrer" style={{ color: '#333', textDecoration: 'underline', fontWeight: 600, margin: '0 2px' }}>Github</a>
              <span style={{ color: '#bbb', fontWeight: 400, margin: '0 6px' }}>/</span>
              <a href="https://x.com/gauravjain0377" target="_blank" rel="noopener noreferrer" style={{ color: '#111', textDecoration: 'underline', fontWeight: 600, margin: '0 2px' }}>X</a>
            </div>
          </div>
        </div>
        {/* Right: Text Content */}
        <div style={{ flex: '2 1 480px', minWidth: 320, maxWidth: 700, marginLeft: 'auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#00796b', marginBottom: '1.2rem', letterSpacing: '-0.01em' }}>
            The Journey from Idea to Impact
          </h2>
          <div style={{ color: '#234b36', fontSize: '1.13rem', fontWeight: 400, marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Like many developers, my journey began with a personal frustration. As a solo trader trying to make sense of the markets, I found myself drowning in a sea of overcomplicated platforms that seemed designed for Wall Street professionals rather than everyday investors like myself.
            <br /><br />
            The breaking point came during a particularly volatile trading session when I missed a crucial market opportunity because I couldn't quickly access the information I needed. The interface was cluttered, the data was buried under layers of menus, and the whole experience felt like fighting against the tool rather than working with it.
            <br /><br />
            That night, I made a decision that would change everything: <span style={{ fontWeight: 700, color: '#184634' }}>I would build the trading platform I wished existed.</span>
          </div>
          {/* Quote Box */}
          <div style={{ background: '#fffbe6', borderRadius: 16, padding: '1.3rem 1.5rem', marginBottom: '2.2rem', borderLeft: '6px solid #184634', boxShadow: '0 2px 12px 0 rgba(255, 206, 86, 0.07)' }}>
            <div style={{ color: '#184634', fontSize: '1.13rem', fontStyle: 'italic', fontWeight: 500, marginBottom: 8 }}>
              <span style={{ fontSize: '1.5rem', verticalAlign: 'middle', marginRight: 8 }}>&#10077;</span>
              The best trading platform isn't the one with the most features—it's the one that gets out of your way and lets you focus on what matters: making informed decisions quickly.
            </div>
            <div style={{ color: '#bfae6a', fontSize: '1rem', fontWeight: 500, marginTop: 2 }}>
              — Personal philosophy that guided development
            </div>
          </div>
          <div style={{ color: '#234b36', fontSize: '1.13rem', fontWeight: 400, marginBottom: '1.5rem', lineHeight: 1.7 }}>
            The development process was both exhilarating and challenging. Working nights and weekends, I spent countless hours researching market data APIs, studying user experience patterns, and prototyping interfaces. Each iteration brought new insights about what traders actually needed versus what they thought they wanted.
            <br /><br />
            The biggest challenge wasn't technical—it was empathy. I had to constantly remind myself that not everyone approaches trading the same way I do. This led to extensive user research, testing with traders of all experience levels, and iterating based on real feedback rather than assumptions.
            <br /><br />
            Today, seeing thousands of traders use the platform daily to make informed decisions brings a sense of fulfillment that goes beyond any technical achievement. <span style={{ fontWeight: 700, color: '#184634' }}>This isn't just a platform—it's a bridge between complex financial data and actionable insights.</span>
          </div>
          {/* Dots at the bottom */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 36 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffe066', display: 'inline-block', opacity: 0.95 }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbe76', display: 'inline-block', opacity: 0.7 }} />
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffe066', display: 'inline-block', opacity: 0.95 }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <MissionValues />
      <JourneySection />
      <Footer />
    </>
  );
}

export default AboutPage;