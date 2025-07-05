import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Github } from "lucide-react";
import GoogleIcon from "../../components/common/GoogleIcon";
import Navbar from "../Navbar";
import { useAuth } from "../../context/AuthContext";
import "./AuthStyles.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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
      const res = await axios.post("http://localhost:3000/api/users/register", {
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
          window.location.href = `http://localhost:5174?${authParams.toString()}`;
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
    // For now, just show a message
    setErrorMsg("Google signup not implemented yet");
  };

  const handleGithubSignup = () => {
    // For now, just show a message
    setErrorMsg("GitHub signup not implemented yet");
  };

    return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-container auth-container-large scroll-container">
          <h2 className="auth-title">Create Your Account</h2>

          {/* Auth Buttons */}
          <div className="auth-button-row">
            <button
              onClick={handleGoogleSignup}
              className="auth-button"
            >
              <GoogleIcon className="w-6 h-6" />
              <span>Sign up with Google</span>
            </button>
            <button
              onClick={handleGithubSignup}
              className="auth-button"
            >
              <Github className="w-6 h-6" />
              <span>Sign up with GitHub</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>— or sign up with email —</span>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="auth-form">
            {errorMsg && (
              <div className={errorMsg.includes("successfully") ? "auth-success" : "auth-error"}>
                {errorMsg}
              </div>
            )}
            <div className="auth-input-group">
              <label className="auth-label">Name*</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Email*</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="auth-input"
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Password*</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                required
                className="auth-input"
              />
            </div>
            <button
              type="submit"
              className="auth-submit"
            >
              Create Account
            </button>
          </form>

          <p className="auth-link">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;