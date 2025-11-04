import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Gaurav Jain",
    avatar: "/images/person1.jpeg",
    text: "The platform's web interface is clean and powerful. I could analyze stock trends and fund performance effortlessly. No clutter, just clarity.",
    meta: "Equity Research Analyst, Mumbai",
  },
  {
    name: "Sneha Rathi",
    avatar: "/images/person5.jpeg",
    text: "As someone who manages her parents' investments, the Hindi support guides made onboarding very smooth. Everything works well on desktop.",
    meta: "Marketing Manager, Jaipur",
  },
  {
    name: "Amitabh Roy",
    avatar: "/images/person2.jpeg",
    text: "I moved my entire portfolio from my previous broker to this platform. The web dashboard makes tax reporting and tracking capital gains very easy.",
    meta: "Chartered Accountant, Kolkata",
  },
  {
    name: "Ritika Sharma",
    avatar: "/images/person6.jpeg",
    text: "The website makes it so easy to handle SIPs for my entire family. I especially liked how the reports visualize our growth over time.",
    meta: "Educator, Chandigarh",
  },
  {
    name: "Kunal Desai",
    avatar: "/images/person3.png",
    text: "The desktop fund screener is excellent. I could shortlist value stocks quickly and build a portfolio suited for long-term growth.",
    meta: "Investor, Surat",
  },
  {
    name: "Megha Pillai",
    avatar: "/images/person7.jpeg",
    text: "I was new to mutual funds but the platform's web tutorials helped a lot. Now I invest with confidence — no need to install anything.",
    meta: "Software Engineer, Kochi",
  },
  {
    name: "Ravi Sekhar",
    avatar: "/images/person4.jpeg",
    text: "As someone who files taxes professionally, I find their capital gains summaries on the web platform extremely helpful and accurate.",
    meta: "Accountant, Hyderabad",
  },
  {
    name: "Anjali Mehta",
    avatar: "/images/person8.jpeg",
    text: "This platform helped me shift from spreadsheets to something modern and visual. Everything I need to track is now one click away.",
    meta: "Freelance Designer, Bengaluru",
  },
];

export default function Testimonials() {
  const [focus, setFocus] = useState(4);
  const [isPaused, setIsPaused] = useState(false);
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
    <section className="w-full flex flex-col items-center py-8 relative " style={{
      background: '#fafafa',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      width: '100%',
    }}
    >
      <h2 className="text-5xl md:text-6xl font-extrabold text-center mb-2 unified-heading" style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif', fontWeight: 900, letterSpacing: '-0.01em' }} data-aos="fade-up">
        Trusted by Indian Traders nationwide
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
          {/* Remove AnimatePresence and key from card container */}
          <div
            ref={cardRef}
            className="flex flex-col items-center justify-center rounded-3xl border-2 shadow-2xl bg-gradient-to-br from-cyan-50 via-white to-fuchsia-100 transition-all duration-500"
            style={{
              width: 'min(520px, 92vw)',
              minWidth: minCardWidth,
              maxWidth: maxCardWidth,
              padding: '2.2rem 1.5rem 2.5rem 1.5rem',
              margin: '0 auto',
              zIndex: 10,
              cursor: 'default',
              boxShadow: '0 8px 32px 0 rgba(34,211,238,0.10), 0 8px 32px 0 rgba(221,0,255,0.07)',
              position: 'relative',
              overflow: 'hidden',
              borderColor: 'rgba(34,211,238,0.35)', // cyan-400 with opacity
            }}
            aria-label={`Focused testimonial from ${testimonials[focus].name}`}
          >
            {/* Decorative quote icon */}
            <motion.div
              key={focus + '-quote'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.18, y: 0, transition: { delay: 0.05 } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
              className="absolute left-6 top-4 text-7xl md:text-8xl select-none pointer-events-none"
              style={{ fontFamily: 'serif', zIndex: 1, color: 'rgba(139,92,246,0.18)' }} // fuchsia-500 with opacity
              aria-hidden="true"
            >
              “
            </motion.div>
            {/* Animate avatar with glow */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={focus + '-avatar'}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 shadow-xl mb-5 bg-slate-100 flex items-center justify-center z-10"
                layoutId={`avatar-${focus}`}
                style={{
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '#00796b',
                  borderColor: '#00796b',
                  width: '112px',
                  height: '112px',
                  borderWidth: '4px',
                }}
                initial={{ scale: 0.8, opacity: 0, boxShadow: '0 0 0 0px #00796b' }}
                animate={{ scale: 1, opacity: 1, boxShadow: '0 0 0 8px rgba(0,121,107,0.15), 0 8px 24px 0 rgba(34,42,53,0.12)', transition: { type: "spring", stiffness: 180, damping: 18, delay: 0.1 } }}
                exit={{ scale: 0.8, opacity: 0, boxShadow: '0 0 0 0px #00796b', transition: { duration: 0.2 } }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 0 10px rgba(0,121,107,0.20)' }}
              >
                <img 
                  src={testimonials[focus].avatar} 
                  alt={testimonials[focus].name} 
                  className="w-full h-full object-cover mx-auto" 
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: 'center',
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/112';
                  }}
                />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={focus + '-name'}
                className="text-2xl font-bold text-center mt-2 mb-2 tracking-tight"
                style={{ color: '#1e293b', fontFamily: 'Poppins, Inter, Montserrat, sans-serif', letterSpacing: '-0.01em' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.12 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                {testimonials[focus].name}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={focus + '-text'}
                className="text-2xl md:text-3xl font-extrabold text-center mb-4 px-2"
                style={{ color: '#222', fontFamily: 'Poppins, Inter, Montserrat, sans-serif', lineHeight: 1.4, maxWidth: 440, margin: '0 auto', letterSpacing: '-0.01em' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                {testimonials[focus].text}
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={focus + '-meta'}
                className="text-base text-slate-500 text-center mt-2 font-semibold italic"
                style={{ fontFamily: 'Poppins, Inter, Montserrat, sans-serif', letterSpacing: '0.01em', paddingBottom: "20px" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.18 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                {testimonials[focus].meta}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      {/* Name pills */}
      <div className="w-full text-center mt-32 md:mt-40 pb-4 pt-5">
        <div className="inline-block">
          <div className="flex flex-wrap justify-center gap-5 md:gap-8 lg:gap-10">
             {testimonials.map((t, i) => (
               <button
                 key={i}
                 className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base tracking-wide transition-all duration-300 whitespace-nowrap focus:outline-none
                   ${i === focus
                     ? 'text-white shadow-lg scale-105'
                     : 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:scale-105 hover:shadow-md hover:border-slate-300'}
                 `}
                 style={{
                   fontFamily: 'Poppins, Inter, Montserrat, sans-serif',
                   borderRadius: '9999px',
                   ...(i === focus ? {
                     background: '#00796b',
                     boxShadow: '0 4px 14px rgba(0, 121, 107, 0.25), 0 2px 4px rgba(0, 121, 107, 0.15)',
                     fontWeight: 700,
                     color: '#ffffff',
                     border: '2px solid #00796b',
                     transform: 'scale(1.05)',
                   } : {
                     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                     fontWeight: 600,
                     border: '1.5px solid #e2e8f0',
                   }),
                   transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                   letterSpacing: '0.03em',
                   margin: '0 0.5rem 0.75rem 0.5rem',
                   textRendering: 'optimizeLegibility',
                   WebkitFontSmoothing: 'antialiased',
                   MozOsxFontSmoothing: 'grayscale',
                   filter: 'none',
                   backdropFilter: 'none',
                   willChange: 'transform',
                   WebkitTextStroke: '0',
                   position: 'relative',
                   overflow: 'hidden',
                 }}
                 onClick={() => {
                   setFocus(i);
                   pause();
                 }}
                 aria-label={`Show testimonial from ${t.name}`}
               >
                 {i === focus && (
                   <span
                     style={{
                       position: 'absolute',
                       top: 0,
                       left: 0,
                       right: 0,
                       bottom: 0,
                       background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)',
                       pointerEvents: 'none',
                     }}
                   />
                 )}
                 <span style={{ position: 'relative', zIndex: 1 }}>
                   {t.name}
                 </span>
               </button>
             ))}
          </div>
        </div>
      </div>

    </section>
  );
}