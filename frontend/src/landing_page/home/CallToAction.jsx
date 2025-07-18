import React from "react";

export default function CallToAction() {
  return (
    <section
      className="w-full flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #007f7f 30%, #ff6a1a 100%)",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <div className="w-full max-w-5xl flex flex-col items-center justify-center text-center mx-auto z-10">
        {/* Headline */}
        <h2
          className="text-9xl md:text-[10rem] font-extrabold text-white mb-4 leading-none"
          style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '-0.03em' }}
        >
          Ready to Start Investing?
        </h2>
        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white mb-4 max-w-2xl mx-auto" style={{ fontWeight: 700 }}>
          Open your free Demat account in under 10 minutes. No paperwork,<br className="hidden md:inline" />
          instant verification for Indian citizens.
        </p>

        {/* Container for Features and Button */}
        <div className="w-full flex flex-col items-center gap-10">
          {/* Feature Row */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 max-w-5xl mx-auto w-full text-center">
            <div className="flex items-center gap-3 min-w-[180px] justify-center">
              <span className="inline-flex items-center justify-center w-7 h-7">
                {/* Icon */}
              </span>
              <span className="text-white text-lg md:text-xl font-medium">SEBI Regulated</span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px] justify-center">
              <span className="inline-flex items-center justify-center w-7 h-7">
                {/* Icon */}
              </span>
              <span className="text-white text-lg md:text-xl font-medium">Zero Account Opening Charges</span>
            </div>
            <div className="flex items-center gap-3 min-w-[220px] justify-center">
              <span className="inline-flex items-center justify-center w-7 h-7">
                {/* Icon */}
              </span>
             <span className="text-white text-lg md:text-xl font-medium mb-10">
           
              24/7 Customer Support</span>
            </div>
          </div>

          {/* CTA Button */}
         <a
  href="/signup"
  className="px-14 py-[10px] rounded-full font-bold text-2xl md:text-3xl shadow-lg min-w-[220px] text-center transition-all duration-200 bg-white text-[#007f7f] border border-[#e0e7ef] hover:bg-[#e0f2f1] hover:text-[#007f7f] hover:scale-105 outline-none focus:ring-4 focus:ring-[#007f7f]/20"
  style={{ fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}
>
  Signup
</a>
        </div>
      </div>
    </section>
  );
}