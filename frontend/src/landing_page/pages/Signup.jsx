import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Github } from "lucide-react";
import GoogleIcon from "../../components/common/GoogleIcon";
import Navbar from "../Navbar";
import { useAuth } from "../../context/AuthContext";
import "./AuthStyles.css";

const ACCENT = '#19c37d';

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Environment URLs
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5174';

  // Get redirectTo from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post(`${API_URL}/api/users/register`, {
        name: form.name,
        email: form.email,
        password: form.password
      });

      console.log("📥 Registration Response:", res.data);

      if (res.data.success) {
        console.log("🔐 Storing auth data:", {
          user: res.data.user,
          token: res.data.token ? "EXISTS" : "MISSING",
          tokenValue: res.data.token
        });
        
        login(res.data.user, res.data.token);
        
        // Immediate verification
        const immediateToken = localStorage.getItem('token');
        const immediateUser = localStorage.getItem('user');
        const immediateLogin = localStorage.getItem('isLoggedIn');
        console.log("🚀 Immediate verification:", {
          token: immediateToken ? "EXISTS" : "MISSING",
          tokenValue: immediateToken,
          user: immediateUser ? "EXISTS" : "MISSING",
          isLoggedIn: immediateLogin
        });
        
        // Verify storage after a delay
        setTimeout(() => {
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          const storedLogin = localStorage.getItem('isLoggedIn');
          console.log("💾 Delayed verification - Stored data:", {
            token: storedToken ? "EXISTS" : "MISSING",
            tokenValue: storedToken,
            user: storedUser ? "EXISTS" : "MISSING",
            isLoggedIn: storedLogin
          });
          
          // Also log the actual user data for debugging
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log("💾 Parsed user data:", parsedUser);
            } catch (e) {
              console.error("💾 Error parsing stored user data:", e);
            }
          }
        }, 100);
        
        // Show success message
        setErrorMsg("Account created successfully! Redirecting to dashboard...");
        
        // Final check before redirect
        setTimeout(() => {
          const finalToken = localStorage.getItem('token');
          const finalUser = localStorage.getItem('user');
          const finalLogin = localStorage.getItem('isLoggedIn');
          console.log("🎯 Final check before redirect:", {
            token: finalToken ? "EXISTS" : "MISSING",
            tokenValue: finalToken,
            user: finalUser ? "EXISTS" : "MISSING",
            isLoggedIn: finalLogin
          });
          
          if (!finalToken || !finalUser || finalLogin !== 'true') {
            console.error("❌ CRITICAL: Auth data missing before redirect!");
            setErrorMsg("Authentication error. Please try again.");
            return;
          }
          
          console.log("🔄 Redirecting to dashboard with auth data...");
          // Pass auth data through URL parameters
          const authParams = new URLSearchParams({
            token: finalToken,
            user: finalUser,
            isLoggedIn: finalLogin
          });
          window.location.href = `${DASHBOARD_URL}?${authParams.toString()}`;
        }, 2000);
      } else {
        setErrorMsg(res.data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${API_URL}/auth/google`;
  };



    return (
    <>
      <Navbar />
      <div style={{ background: '#FAFAFA', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: 900,
          minHeight: 520,
          background: 'white',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
          overflow: 'hidden',
        }}>
          {/* Left: Form Card */}
          <div style={{ flex: 1.2, padding: '48px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/media/images/logo.png" alt="Logo" style={{ height: 36, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', background: '#fff' }} />
              <span style={{ fontWeight: 700, fontSize: 20, color: '#222', letterSpacing: '-0.01em' }}>StockSathi</span>
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: ACCENT, marginBottom: 8, fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>Create Your Account</h2>
             <div style={{ margin: '18px 0 18px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <button 
              onClick={handleGoogleSignup}
              style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#f5f6fa', border: '1.5px solid #e0e7ef', borderRadius: 16, padding: '0 20px', height: 48, fontWeight: 600, fontSize: 17, color: '#222', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer', width: '100%', maxWidth: '100%', justifyContent: 'center', transition: 'background 0.18s' }}
            >
              <img src="/media/images/google-logo.png" alt="Google" style={{ width: 24, height: 24, background: 'none', borderRadius: 0, display: 'block' }} />
              <span style={{ fontWeight: 600, fontSize: 17 }}>Continue with Google</span>
            </button>
              </div>
            <div style={{ color: '#888', fontSize: 15, marginBottom: 18, textAlign: 'center', fontWeight: 500, letterSpacing: '0.01em' }}>or sign up with email</div>
            <form onSubmit={handleRegister} className="auth-form" style={{ width: '100%' }}>
              {errorMsg && (
                <div className={errorMsg.includes("successfully") ? "auth-success" : "auth-error"}>
                  {errorMsg}
                </div>
              )}
              <div className="auth-input-group">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  className="auth-input"
                  style={{ marginBottom: 16, fontSize: 16, padding: '12px 16px', border: '1.5px solid #e0e7ef', borderRadius: 12, background: '#f8fafc', color: '#222', fontWeight: 500, letterSpacing: '0.01em', boxShadow: 'none', outline: 'none', transition: 'border 0.18s' }}
                />
              </div>
              <div className="auth-input-group">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="auth-input"
                  style={{ marginBottom: 16, fontSize: 16, padding: '12px 16px', border: '1.5px solid #e0e7ef', borderRadius: 12, background: '#f8fafc', color: '#222', fontWeight: 500, letterSpacing: '0.01em', boxShadow: 'none', outline: 'none', transition: 'border 0.18s' }}
                />
              </div>
              <div className="auth-input-group">
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    className="auth-input"
                    style={{ marginBottom: 8, fontSize: 16, padding: '12px 16px', border: '1.5px solid #e0e7ef', borderRadius: 12, background: '#FAFAFA', color: '#222', fontWeight: 500, letterSpacing: '0.01em', boxShadow: 'none', outline: 'none', transition: 'border 0.18s', width: '100%' }}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, margin: 0 }} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? (
                      // Eye open icon
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/></svg>
                    ) : (
                      // Eye off icon (with strike)
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-7 0-11-7-11-7a21.77 21.77 0 0 1 5.06-5.94" stroke="#888" strokeWidth="2"/><path d="M1 1l22 22" stroke="#888" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="2"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" style={{ width: '100%', background: ACCENT, color: 'white', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 22, padding: '12px 0', marginBottom: 8, boxShadow: '0 2px 8px rgba(25,195,125,0.10)', cursor: 'pointer', transition: 'background 0.18s' }}>CREATE ACCOUNT</button>
            </form>
          </div>
          {/* Right: Accent Panel */}
          <div style={{ flex: 1, background: ACCENT, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', position: 'relative' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: 12, fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>Welcome Back!</h2>
            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 32, textAlign: 'center', opacity: 0.95 }}>To keep connected with us<br/>please login with your personal info</div>
            <Link to="/login" style={{ border: '2px solid #fff', color: '#fff', fontWeight: 700, fontSize: 18, borderRadius: 22, padding: '12px 44px', background: 'transparent', textDecoration: 'none', transition: 'all 0.18s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              LOGIN
            </Link>
          </div>
        </div>
      </div>
      {/* Add a style block for input placeholder globally for this component */}
      <style>{`
        ::placeholder {
          color: #888 !important;
          opacity: 1 !important;
          font-weight: 500 !important;
          font-size: 15px !important;
        }
      `}</style>
    </>
  );
};

export default Signup;