import React from "react";

export default function CallToAction() {
  return (
    <section
      className="w-full flex flex-col items-center justify-center min-h-[480px] py-20 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #007f7f 30%, #ff6a1a 100%)",
      }}
    >
      <div className="max-w-3xl w-full flex flex-col items-center justify-center mx-auto text-center z-10">
        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
          style={{
            color: "#ffffff",
            fontFamily: "Inter, Poppins, Montserrat, sans-serif",
          }}
        >
          Ready to Start Investing?
        </h2>

        {/* Subtitle */}
        <p
          className="text-base md:text-lg font-normal mb-6 leading-relaxed"
          style={{
            color: "#e0f2f1",
            fontFamily: "Inter, Poppins, Montserrat, sans-serif",
          }}
        >
          Open your free Demat account in under 10 minutes. No paperwork,{" "}
          <br className="hidden md:inline" />
          instant verification for Indian citizens.
        </p>

        {/* Feature List */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-gray-200 font-normal">
          <div className="flex items-center gap-2">
          <span className="inline-block align-middle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-gray-200 align-middle shrink-0"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 8v4l3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="align-middle">SEBI Regulated</span>
          </div>
          <div className="flex items-center gap-2">
          <span className="inline-block align-middle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-gray-200 align-middle shrink-0"><path d="M13 16h-1v-4h-1m4 0h-1v4h-1m-4 0h-1v-4h-1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="align-middle">Zero Account Opening Charges</span>
          </div>
           <div className="flex items-center gap-2">
            <span className="inline-block align-middle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4 text-gray-200 align-middle shrink-0"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 8v4l3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="align-middle">24/7 Customer Support</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-2">
          <a
            href="/signup"
            className="px-6 py-3 rounded-lg bg-white text-teal-700 font-semibold text-base shadow-md hover:bg-teal-50 transition min-w-[180px]"
          >
            Open Free Account
          </a>
          <a
            href="#"
            className="text-base font-semibold text-white px-0 py-3 hover:underline transition min-w-[180px] flex items-center justify-center"
          >
            Download Mobile App <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
