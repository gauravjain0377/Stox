import React from "react";

function TrustedInvestors() {
  return (
    <section
      className="w-full flex justify-center items-center py-16"
      style={{ background: "linear-gradient(180deg, #f6fcfa 80%, #fff8f3 100%)", borderRadius: "2.5rem", marginTop: "-2rem" }}
    >
      <div className="w-full max-w-6xl px-2 md:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-3" style={{ color: "#00796b", letterSpacing: "-0.01em", fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>
          Trusted by Indian Investors
        </h2>
        <p className="text-center text-lg md:text-xl text-slate-600 mb-12" style={{ fontWeight: 500, fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>
          India's most reliable trading platform with cutting-edge technology, regulatory compliance, and unwavering commitment to investor success.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl border flex flex-col items-center justify-center text-center" style={{ borderColor: "#b6f0df", padding: '2.5rem 1.5rem', minHeight: 220, boxShadow: '0 1px 8px rgba(34,42,53,0.03)' }}>
            <div className="mb-2" style={{ lineHeight: 1 }}>
              <span style={{ fontWeight: 800, fontSize: "2.6rem", color: "#00796b", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '-0.01em' }}>2</span>
              <span style={{ fontWeight: 700, fontSize: "1.7rem", color: '#16a34a', marginLeft: 2, fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>M+</span>
            </div>
            <div className="text-lg md:text-xl font-bold mb-1" style={{ color: "#0f3d3e", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.2 }}>Active Traders</div>
            <div className="text-slate-500 text-base mt-2" style={{ fontWeight: 400, fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.6 }}>
              Growing community of retail and institutional investors actively trading on our platform
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-2xl border flex flex-col items-center justify-center text-center" style={{ borderColor: "#b6f0df", padding: '2.5rem 1.5rem', minHeight: 220, boxShadow: '0 1px 8px rgba(34,42,53,0.03)' }}>
            <div className="mb-2" style={{ lineHeight: 1 }}>
              <span style={{ fontWeight: 800, fontSize: "2.3rem", color: "#00796b", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '-0.01em' }}>₹50,000</span>
              <span style={{ fontWeight: 700, fontSize: "1.2rem", color: '#16a34a', marginLeft: 2, fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>Cr+</span>
            </div>
            <div className="text-lg md:text-xl font-bold mb-1" style={{ color: "#0f3d3e", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.2 }}>Assets Under Management</div>
            <div className="text-slate-500 text-base mt-2" style={{ fontWeight: 400, fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.6 }}>
              Total value of assets managed and traded through our secure platform
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-2xl border flex flex-col items-center justify-center text-center" style={{ borderColor: "#b6f0df", padding: '2.5rem 1.5rem', minHeight: 220, boxShadow: '0 1px 8px rgba(34,42,53,0.03)' }}>
            <div className="mb-2" style={{ lineHeight: 1 }}>
              <span style={{ fontWeight: 800, fontSize: "2.3rem", color: "#00796b", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '-0.01em' }}>100</span>
              <span style={{ fontWeight: 700, fontSize: "1.2rem", color: '#16a34a', marginLeft: 2, fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>%</span>
            </div>
            <div className="text-lg md:text-xl font-bold mb-1" style={{ color: "#0f3d3e", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.2 }}>Uptime Guaranteed</div>
            <div className="text-slate-500 text-base mt-2" style={{ fontWeight: 400, fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.6 }}>
              Rock-solid infrastructure ensuring your trades execute when markets move
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-white rounded-2xl border flex flex-col items-center justify-center text-center" style={{ borderColor: "#ffd7b3", padding: '2.5rem 1.5rem', minHeight: 220, boxShadow: '0 1px 8px rgba(34,42,53,0.03)' }}>
            <div className="mb-2" style={{ lineHeight: 1 }}>
              <span style={{ fontWeight: 900, fontSize: "2.3rem", color: "#ff6600", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', letterSpacing: '0.01em' }}>SEBI</span>
            </div>
            <div className="text-lg md:text-xl font-bold mb-1" style={{ color: "#0f3d3e", fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.2 }}>SEBI Registered & Regulated</div>
            <div className="text-slate-500 text-base mt-2" style={{ fontWeight: 400, fontFamily: 'Inter, Poppins, Montserrat, sans-serif', lineHeight: 1.6 }}>
              Fully compliant with Indian securities regulations for your peace of mind
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustedInvestors; 