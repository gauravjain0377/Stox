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

          </div>
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section style={{ background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)', padding: '6rem 0 6rem 0', minHeight: '60vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        {/* Centered Profile Card Section */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '4rem',
          position: 'relative'
        }}>
          {/* Profile Card Container */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 'clamp(20px, 2.5vw, 24px)',
            padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
            boxShadow: '0 8px 32px rgba(0,121,107,0.08), 0 2px 16px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,121,107,0.1)',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative background elements */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,121,107,0.05) 0%, transparent 70%)',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,224,102,0.08) 0%, transparent 70%)',
              zIndex: 0
            }} />
            
            {/* Profile Photo Section - Centered */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              marginBottom: '2rem'
            }}>
              <div style={{
                width: 'clamp(220px, 25vw, 280px)',
                height: 'clamp(220px, 25vw, 280px)',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 60% 40%, #fffde4 70%, #fffbe6 100%)',
                boxShadow: '0 0 0 clamp(6px, 0.8vw, 10px) #e0f2ef, 0 0 0 clamp(8px, 1vw, 14px) rgba(0,121,107,0.15), 0 12px 40px rgba(0,127,127,0.15)',
                border: 'clamp(3px, 0.4vw, 4px) solid #007f7f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'transform 0.3s ease',
              }}>
                {/* Decorative circles */}
                <div style={{ 
                  width: 'clamp(110px, 13vw, 140px)', 
                  height: 'clamp(110px, 13vw, 140px)', 
                  borderRadius: '50%', 
                  background: 'rgba(233,236,239,0.6)', 
                  position: 'absolute', 
                  left: 'clamp(25%, 25%, 50%)',
                  top: 'clamp(25%, 25%, 50%)',
                  animation: 'pulse 3s ease-in-out infinite'
                }} />
                <div style={{ 
                  width: 'clamp(160px, 18vw, 200px)', 
                  height: 'clamp(160px, 18vw, 200px)', 
                  borderRadius: '50%', 
                  background: 'rgba(248,249,250,0.5)', 
                  position: 'absolute', 
                  left: 'clamp(14%, 14%, 14%)',
                  top: 'clamp(14%, 14%, 14%)'
                }} />
                {/* White circle behind the photo */}
                <div style={{ 
                  width: 'clamp(180px, 21vw, 220px)', 
                  height: 'clamp(180px, 21vw, 220px)', 
                  borderRadius: '50%', 
                  background: '#fff', 
                  position: 'absolute', 
                  zIndex: 2,
                  boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)'
                }} />
                <img 
                  src="/media/images/Gaurav_Jain.png" 
                  alt="Gaurav Jain" 
                  style={{ 
                    width: 'clamp(180px, 21vw, 220px)', 
                    height: 'clamp(180px, 21vw, 220px)', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    zIndex: 3, 
                    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                    border: 'clamp(2px, 0.3vw, 3px) solid #ffffff'
                  }} 
                />
              </div>
              
              {/* Name */}
              <div style={{ 
                marginTop: '2rem',
                textAlign: 'center',
                width: '100%'
              }}>
                <h3 style={{ 
                  color: '#00796b', 
                  fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', 
                  fontWeight: 800, 
                  margin: 0,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(135deg, #00796b 0%, #005f56 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  GAURAV JAIN
                </h3>
                <div style={{
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #00796b 0%, #ffe066 50%, #00796b 100%)',
                  margin: '1rem auto 0 auto',
                  borderRadius: '2px'
                }} />
              </div>
              
              {/* Zen Quote */}
              <div style={{ 
                marginTop: '2rem', 
                textAlign: 'center',
                padding: '1.2rem 2rem',
                background: 'linear-gradient(135deg, rgba(255,224,102,0.1) 0%, rgba(255,190,118,0.08) 100%)',
                borderRadius: '16px',
                border: '1px solid rgba(255,224,102,0.2)',
                width: '100%',
                maxWidth: '500px'
              }}>
                <div style={{ 
                  color: '#184634', 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  marginBottom: '0.5rem',
                  letterSpacing: '0.01em'
                }}>
                  Playing cricket is his zen.
                </div>
              </div>
              
              {/* Social Links */}
              <div style={{ 
                marginTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <a 
                  href="https://www.linkedin.com/in/this-is-gaurav-jain/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    color: '#00796b', 
                    textDecoration: 'none', 
                    fontWeight: 600, 
                    fontSize: '1.05rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(0,121,107,0.05)',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(0,121,107,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,121,107,0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0,121,107,0.05)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/gauravjain0377" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    color: '#00796b', 
                    textDecoration: 'none', 
                    fontWeight: 600, 
                    fontSize: '1.05rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(0,121,107,0.05)',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(0,121,107,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,121,107,0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0,121,107,0.05)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Github
                </a>
                <a 
                  href="https://x.com/gauravjain0377" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    color: '#00796b', 
                    textDecoration: 'none', 
                    fontWeight: 600, 
                    fontSize: '1.05rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(0,121,107,0.05)',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(0,121,107,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0,121,107,0.1)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0,121,107,0.05)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  X
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content Section - Centered below photo */}
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: '2.6rem', 
            fontWeight: 800, 
            color: '#00796b', 
            marginBottom: '1.5rem', 
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            The Journey from Idea to Impact
          </h2>
          
          <div style={{ 
            color: '#234b36', 
            fontSize: '1.15rem', 
            fontWeight: 400, 
            marginBottom: '2rem', 
            lineHeight: 1.8,
            textAlign: 'left'
          }}>
            Like many developers, my journey began with a personal frustration. As a solo trader trying to make sense of the markets, I found myself drowning in a sea of overcomplicated platforms that seemed designed for Wall Street professionals rather than everyday investors like myself.
            <br /><br />
            The breaking point came during a particularly volatile trading session when I missed a crucial market opportunity because I couldn't quickly access the information I needed. The interface was cluttered, the data was buried under layers of menus, and the whole experience felt like fighting against the tool rather than working with it.
            <br /><br />
            That night, I made a decision that would change everything: <span style={{ fontWeight: 700, color: '#184634' }}>I would build the trading platform I wished existed.</span>
          </div>
          
          {/* Quote Box */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fffbe6 0%, #fff9e0 100%)', 
            borderRadius: '20px', 
            padding: '2rem 2.5rem', 
            marginBottom: '2.5rem', 
            borderLeft: '6px solid #184634', 
            boxShadow: '0 4px 20px rgba(255, 206, 86, 0.12)',
            textAlign: 'left',
            position: 'relative'
          }}>
            <div style={{ 
              color: '#184634', 
              fontSize: '1.2rem', 
              fontStyle: 'italic', 
              fontWeight: 500, 
              marginBottom: '1rem',
              lineHeight: 1.6
            }}>
              <span style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: '0.5rem', color: '#00796b' }}>&#10077;</span>
              The best trading platform isn't the one with the most features—it's the one that gets out of your way and lets you focus on what matters: making informed decisions quickly.
            </div>
            <div style={{ color: '#bfae6a', fontSize: '1.05rem', fontWeight: 600, marginTop: '0.5rem' }}>
              — Personal philosophy that guided development
            </div>
          </div>
          
          <div style={{ 
            color: '#234b36', 
            fontSize: '1.15rem', 
            fontWeight: 400, 
            marginBottom: '2rem', 
            lineHeight: 1.8,
            textAlign: 'left'
          }}>
            The development process was both exhilarating and challenging. Working nights and weekends, I spent countless hours researching market data APIs, studying user experience patterns, and prototyping interfaces. Each iteration brought new insights about what traders actually needed versus what they thought they wanted.
            <br /><br />
            The biggest challenge wasn't technical—it was empathy. I had to constantly remind myself that not everyone approaches trading the same way I do. This led to extensive user research, testing with traders of all experience levels, and iterating based on real feedback rather than assumptions.
            <br /><br />
            Today, seeing thousands of traders use the platform daily to make informed decisions brings a sense of fulfillment that goes beyond any technical achievement. <span style={{ fontWeight: 700, color: '#184634' }}>This isn't just a platform—it's a bridge between complex financial data and actionable insights.</span>
          </div>
          
          {/* Decorative Dots */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: 20, 
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(0,121,107,0.1)'
          }}>
            <span style={{ 
              width: 14, 
              height: 14, 
              borderRadius: '50%', 
              background: '#ffe066', 
              display: 'inline-block', 
              opacity: 0.95,
              boxShadow: '0 2px 8px rgba(255,224,102,0.3)'
            }} />
            <span style={{ 
              width: 14, 
              height: 14, 
              borderRadius: '50%', 
              background: '#ffbe76', 
              display: 'inline-block', 
              opacity: 0.8,
              boxShadow: '0 2px 8px rgba(255,190,118,0.3)'
            }} />
            <span style={{ 
              width: 14, 
              height: 14, 
              borderRadius: '50%', 
              background: '#ffe066', 
              display: 'inline-block', 
              opacity: 0.95,
              boxShadow: '0 2px 8px rgba(255,224,102,0.3)'
            }} />
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