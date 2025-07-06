import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Github } from "lucide-react";
import GoogleIcon from "../../components/common/GoogleIcon";
import Navbar from "../Navbar";
import { useAuth } from "../../context/AuthContext";
import "./AuthStyles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get redirectTo from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirectTo');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Debug: Log what we're sending
    console.log("📤 Sending login request:", { email, password: password ? "***" : "undefined" });

    try {
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      console.log("📥 Login Response:", res.data);
      
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
        setErrorMsg("Login successful! Redirecting to dashboard...");
        
        // Immediate redirect attempt
        const immediateRedirect = () => {
          const finalToken = localStorage.getItem('token');
          const finalUser = localStorage.getItem('user');
          const finalLogin = localStorage.getItem('isLoggedIn');
          
          if (finalToken && finalUser && finalLogin === 'true') {
            console.log("🚀 Immediate redirect attempt...");
            const authParams = new URLSearchParams({
              token: finalToken,
              user: finalUser,
              isLoggedIn: finalLogin
            });
            const dashboardUrl = `http://localhost:5174?${authParams.toString()}`;
            console.log("🚀 Immediate redirect URL:", dashboardUrl);
            window.location.href = dashboardUrl;
          }
        };
        
        // Try immediate redirect
        setTimeout(immediateRedirect, 100);
        
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
          const dashboardUrl = `http://localhost:5174?${authParams.toString()}`;
          console.log("🔄 Dashboard URL:", dashboardUrl);
          
          // Try redirecting to dashboard
          try {
            window.location.href = dashboardUrl;
          } catch (error) {
            console.error("❌ Redirect failed:", error);
            // Fallback: open in new tab
            window.open(dashboardUrl, '_blank');
          }
        }, 500);
      } else {
        setErrorMsg(res.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", JSON.stringify(err.response?.data, null, 2));
      console.error("Error status:", err.response?.status);
      console.error("Full error object:", JSON.stringify(err, null, 2));
      setErrorMsg(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    // For now, just show a message
    setErrorMsg("Google login not implemented yet");
  };

  const handleGithubLogin = () => {
    // For now, just show a message
    setErrorMsg("GitHub login not implemented yet");
  };

    return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-container">
          <h2 className="auth-title">Welcome Back 👋</h2>
          <p className="auth-subtitle">Login to continue</p>

          <div className="auth-buttons">
            <button
              onClick={handleGoogleLogin}
              className="auth-button"
            >
              <GoogleIcon className="w-6 h-6" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={handleGithubLogin}
              className="auth-button"
            >
              <Github className="w-6 h-6" />
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>— or login with email —</span>
          </div>

          <form onSubmit={handleLogin} className="auth-form">
            {errorMsg && (
              <div className={errorMsg.includes("successful") ? "auth-success" : "auth-error"}>
                {errorMsg}
              </div>
            )}
            <div className="auth-input-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="********"
                required
              />
            </div>
            <button
              type="submit"
              className="auth-submit"
            >
              Login
            </button>
          </form>

          <p className="auth-link">
            Don't have an account?{" "}
            <Link to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;