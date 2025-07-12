import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Gaurav Jain",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    text: "The platform’s web interface is clean and powerful. I could analyze stock trends and fund performance effortlessly. No clutter, just clarity.",
    meta: "Equity Research Analyst, Mumbai",
  },
  {
    name: "Sneha Rathi",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "As someone who manages her parents’ investments, the Hindi support guides made onboarding very smooth. Everything works well on desktop.",
    meta: "Marketing Manager, Jaipur",
  },
  {
    name: "Amitabh Roy",
    avatar: "https://randomuser.me/api/portraits/men/64.jpg",
    text: "I moved my entire portfolio from my previous broker to this platform. The web dashboard makes tax reporting and tracking capital gains very easy.",
    meta: "Chartered Accountant, Kolkata",
  },
  {
    name: "Ritika Sharma",
    avatar: "https://randomuser.me/api/portraits/women/52.jpg",
    text: "The website makes it so easy to handle SIPs for my entire family. I especially liked how the reports visualize our growth over time.",
    meta: "Educator, Chandigarh",
  },
  {
    name: "Kunal Desai",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    text: "The desktop fund screener is excellent. I could shortlist value stocks quickly and build a portfolio suited for long-term growth.",
    meta: "Investor, Surat",
  },
  {
    name: "Megha Pillai",
    avatar: "https://randomuser.me/api/portraits/women/48.jpg",
    text: "I was new to mutual funds but the platform’s web tutorials helped a lot. Now I invest with confidence — no need to install anything.",
    meta: "Software Engineer, Kochi",
  },
  {
    name: "Ravi Sekhar",
    avatar: "https://randomuser.me/api/portraits/men/66.jpg",
    text: "As someone who files taxes professionally, I find their capital gains summaries on the web platform extremely helpful and accurate.",
    meta: "Accountant, Hyderabad",
  },
  {
    name: "Anjali Mehta",
    avatar: "https://randomuser.me/api/portraits/women/61.jpg",
    text: "This platform helped me shift from spreadsheets to something modern and visual. Everything I need to track is now one click away.",
    meta: "Freelance Designer, Bengaluru",
  },
];

export default function Testimonials() {
  const [focus, setFocus] = useState(4); // Centered on Priya Sharma by default
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef();
  const prevFocus = useRef(focus);
  const cardRef = useRef();



  // Pause on hover/interact
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  // Animation direction for slide
  const direction = focus > prevFocus.current ? 1 : -1;
  useEffect(() => { prevFocus.current = focus; }, [focus]);

  // Responsive max width
  const maxCardWidth = 520;
  const minCardWidth = 320;

  return (
    <section className="w-full flex flex-col items-center py-2 mb-2 relative" style={{
      background: 'linear-gradient(180deg, #f6fcfa 60%, #f3f6ff 100%)',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      width: '100%',
    }}
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-2" style={{ color: '#1e293b', fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>
        Trusted by Indian traders nationwide
      </h2>
      <p className="text-center text-lg text-slate-600 mb-5" style={{ fontWeight: 500 }}>
        Join thousands of successful traders making smart investment decisions.
      </p>
      {/* Carousel */}
      <div
  className="relative flex justify-center items-center w-full"
  style={{ perspective: 1800, minHeight: 0 }}
  onMouseEnter={pause}
  onMouseLeave={resume}
  onTouchStart={pause}
  onTouchEnd={resume}
>

        
      
        {/* Cards */}
        <div className="relative flex items-center justify-center w-full max-w-[900px] mx-auto" style={{
    height: 'auto',
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={focus}
              ref={cardRef}
              className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 backdrop-blur-xl bg-white/90 shadow-xl"
              initial={{
                opacity: 0,
                scale: 0.92,
                x: direction > 0 ? 120 : -120,
                rotateY: direction > 0 ? 18 : -18,
              }}
              animate={{
                opacity: 1,
                scale: 1.08,
                x: 0,
                rotateY: 0,
                transition: { type: "spring", stiffness: 120, damping: 18 }
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                x: direction > 0 ? -120 : 120,
                rotateY: direction > 0 ? -18 : 18,
                transition: { duration: 0.45, ease: "easeInOut" }
              }}
              style={{
                width: 'min(520px, 92vw)',
                minWidth: minCardWidth,
                maxWidth: maxCardWidth,
                padding: '1.5rem 1.2rem',
                margin: '0 auto',
                zIndex: 10,
                cursor: 'default',
              }}
              tabIndex={0}
              aria-label={`Focused testimonial from ${testimonials[focus].name}`}
            >
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-400 shadow-xl mb-5 bg-slate-100 flex items-center justify-center z-10"
                layoutId={`avatar-${focus}`}
                style={{
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0 0 0 8px rgba(34,211,238,0.10), 0 8px 32px 0 rgba(34,42,53,0.10)',
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 180, damping: 18, delay: 0.1 } }}
                exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
              >
                <img src={testimonials[focus].avatar} alt={testimonials[focus].name} className="w-full h-full object-cover mx-auto" />
              </motion.div>
              {/* Name */}
              <div className="text-xl font-bold text-center mt-2 mb-2" style={{ color: '#1e293b', fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>
                {testimonials[focus].name}
              </div>
              <motion.div
                className="text-2xl md:text-3xl font-extrabold text-center mb-4"
                style={{ color: '#222', fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.35, maxWidth: 440, margin: '0 auto' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.15, type: "spring", stiffness: 120 } }}
                exit={{ opacity: 0, y: -30, transition: { duration: 0.2 } }}
              >
                {testimonials[focus].text}
              </motion.div>
              <motion.div
                className="text-base text-slate-500 text-center mt-2 font-semibold"
                style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '0.01em' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.22, type: "spring", stiffness: 120 } }}
                exit={{ opacity: 0, y: 20, transition: { duration: 0.15 } }}
              >
                {testimonials[focus].meta}
              </motion.div>
            </motion.div>
          </AnimatePresence>
          {/* Side cards for 3D effect, always visible but not interactive */}
          {[-1, 1].map((offset) => {
            const idx = (focus + offset + testimonials.length) % testimonials.length;
            return (
              <motion.div
                key={idx}
                className="absolute flex flex-col items-center justify-center rounded-3xl border border-slate-200 backdrop-blur-xl bg-white/80 shadow-lg left-1/2 top-1/2"
                style={{
                  width: 'min(370px, 80vw)',
                  minWidth: 220,
                  maxWidth: 370,
                  minHeight: 180,
                  padding: '1.2rem 1.1rem',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translateX(${offset * 240}px) scale(0.92) rotateY(${offset * 24}deg)`,
                  zIndex: 20,
                  filter: 'blur(0.5px) grayscale(0.2)',
                  opacity: 0.7,
                  pointerEvents: 'none',
                }}
                tabIndex={-1}
                aria-hidden="true"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 shadow mb-2 bg-slate-100 flex items-center justify-center mx-auto">
                  <img src={testimonials[idx].avatar} alt={testimonials[idx].name} className="w-full h-full object-cover mx-auto rounded-full" />
                </div>
                <div className="text-base font-semibold text-center mb-2" style={{ color: '#222', fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.2, maxWidth: 260, margin: '0 auto', opacity: 0.7 }}>
                  {testimonials[idx].text.slice(0, 60) + '...'}
                </div>
                <div className="text-xs text-slate-400 text-center mt-1" style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '0.01em' }}>{testimonials[idx].meta}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {/* Name pills */}
      <div className="w-full text-center mt-14 pb-4">
        <div className="inline-block">
          <div className="flex flex-wrap justify-center gap-5">
            {testimonials.map((t, i) => (
              <button
                key={i}
                className={`px-6 py-2 rounded-full font-semibold text-base tracking-wide transition-all duration-300 whitespace-nowrap shadow-md focus:outline-none border
                  ${i === focus
                    ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-lg scale-110 ring-2 ring-cyan-400 border-transparent'
                    : 'bg-slate-200 text-slate-800 border border-slate-300 shadow-sm hover:bg-slate-300 hover:text-cyan-700'}
                `}
                style={{
                  fontFamily: 'Inter, Poppins, Montserrat, sans-serif',
                  boxShadow: i === focus ? '0 4px 16px 0 rgba(34,211,238,0.15)' : undefined,
                  transition: 'box-shadow 0.2s, background 0.2s, color 0.2s, transform 0.2s',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                }}
                onClick={() => {
                  setFocus(i);
                  pause();
                  setTimeout(() => {
                    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 50);
                }}
                aria-label={`Show testimonial from ${t.name}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Custom animations */}
      <style>{`
        ::-webkit-scrollbar { height: 6px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0e7ef; border-radius: 3px; }
      `}</style>
    </section>
  );
} 