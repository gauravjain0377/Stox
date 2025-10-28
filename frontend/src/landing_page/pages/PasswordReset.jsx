import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import "./AuthStyles.css";

const ACCENT = '#19c37d';

const PasswordReset = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code, 3: Enter new password
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // Environment URLs
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Timer for resend cooldown
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle input changes for verification code
  const handleCodeChange = (index, value) => {
    // Allow only numbers
    if (value && !/^\d$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newCode = [...verificationCode];
        newCode[index - 1] = "";
        setVerificationCode(newCode);
      }
    }
  };

  // Send password reset code
  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMsg("Please enter your email address");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    
    setIsSendingCode(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const res = await axios.post(`${API_URL}/api/users/send-password-reset-code`, {
        email
      });
      
      if (res.data.success) {
        setSuccessMsg("Password reset code sent to your email!");
        setStep(2); // Move to code verification step
        setTimer(60); // 60 seconds cooldown
      } else {
        setErrorMsg(res.data.message || "Failed to send reset code");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setIsSendingCode(false);
    }
  };

  // Resend password reset code
  const handleResendCode = async () => {
    if (isSendingCode || timer > 0) return;
    
    setIsSendingCode(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const res = await axios.post(`${API_URL}/api/users/send-password-reset-code`, {
        email
      });
      
      if (res.data.success) {
        setSuccessMsg("Password reset code sent successfully!");
        setTimer(60); // 60 seconds cooldown
      } else {
        setErrorMsg(res.data.message || "Failed to resend reset code");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to resend reset code");
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verify reset code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    
    // Check if all code fields are filled
    if (verificationCode.some(code => !code)) {
      setErrorMsg("Please enter the complete verification code");
      return;
    }
    
    const code = verificationCode.join("");
    
    setIsVerifyingCode(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      // We'll verify the code when resetting the password
      setStep(3); // Move to password reset step
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to verify code");
      // Clear code fields
      setVerificationCode(["", "", "", "", "", ""]);
      document.getElementById("code-0").focus();
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setErrorMsg("Please enter a new password");
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    
    setIsResettingPassword(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const code = verificationCode.join("");
      const res = await axios.post(`${API_URL}/api/users/reset-password`, {
        email,
        code,
        newPassword
      });
      
      if (res.data.success) {
        setSuccessMsg("Password reset successfully! You can now log in with your new password.");
        // Clear form
        setNewPassword("");
        setConfirmPassword("");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setErrorMsg(res.data.message || "Failed to reset password");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Render step 1: Enter email
  const renderStep1 = () => (
    <form onSubmit={handleSendCode} className="auth-form" style={{ width: '100%' }}>
      {errorMsg && (
        <div className="auth-error">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="auth-success">
          {successMsg}
        </div>
      )}
      <div className="auth-input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          placeholder="Enter your email address"
          required
          style={{ 
            marginBottom: 16, 
            fontSize: 16, 
            padding: '12px 16px', 
            border: '1.5px solid #e0e7ef', 
            borderRadius: 12, 
            background: '#f8fafc', 
            color: '#222', 
            fontWeight: 500, 
            letterSpacing: '0.01em', 
            boxShadow: 'none', 
            outline: 'none', 
            transition: 'border 0.18s' 
          }}
        />
      </div>
      <button 
        type="submit" 
        style={{ 
          width: '100%', 
          background: ACCENT, 
          color: 'white', 
          fontWeight: 700, 
          fontSize: 18, 
          border: 'none', 
          borderRadius: 22, 
          padding: '12px 0', 
          marginBottom: 8, 
          boxShadow: '0 2px 8px rgba(25,195,125,0.10)', 
          cursor: isSendingCode ? 'not-allowed' : 'pointer', 
          transition: 'background 0.18s',
          opacity: isSendingCode ? 0.7 : 1
        }}
        disabled={isSendingCode}
      >
        {isSendingCode ? 'SENDING CODE...' : 'SEND RESET CODE'}
      </button>
    </form>
  );

  // Render step 2: Enter verification code
  const renderStep2 = () => (
    <form onSubmit={handleVerifyCode} className="auth-form" style={{ width: '100%' }}>
      {errorMsg && (
        <div className="auth-error">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="auth-success">
          {successMsg}
        </div>
      )}
      
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: '#666', marginBottom: 16, fontSize: 16, textAlign: 'center' }}>
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="auth-input"
              style={{
                width: 50,
                height: 50,
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                padding: 0,
                border: '2px solid #e0e7ef',
                borderRadius: 12,
                background: '#f8fafc',
                color: '#222',
                outline: 'none',
                transition: 'border 0.18s',
                textTransform: 'uppercase'
              }}
              disabled={isVerifyingCode}
            />
          ))}
        </div>
        <div style={{ textAlign: 'center', color: '#888', fontSize: 14 }}>
          Enter the 6-digit code
        </div>
      </div>
      
      <button 
        type="submit" 
        style={{ 
          width: '100%', 
          background: ACCENT, 
          color: 'white', 
          fontWeight: 700, 
          fontSize: 18, 
          border: 'none', 
          borderRadius: 22, 
          padding: '12px 0', 
          marginBottom: 16, 
          boxShadow: '0 2px 8px rgba(25,195,125,0.10)', 
          cursor: isVerifyingCode ? 'not-allowed' : 'pointer', 
          transition: 'background 0.18s',
          opacity: isVerifyingCode ? 0.7 : 1
        }}
        disabled={isVerifyingCode}
      >
        {isVerifyingCode ? 'VERIFYING...' : 'VERIFY CODE'}
      </button>
      
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <p style={{ color: '#666', fontSize: 15 }}>
          Didn't receive the code?{' '}
          <button
            onClick={handleResendCode}
            disabled={isSendingCode || timer > 0}
            style={{
              background: 'none',
              border: 'none',
              color: timer > 0 ? '#999' : ACCENT,
              fontWeight: 600,
              cursor: timer > 0 ? 'not-allowed' : 'pointer',
              textDecoration: 'underline',
              fontSize: 15
            }}
          >
            {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
          </button>
        </p>
      </div>
    </form>
  );

  // Render step 3: Enter new password
  const renderStep3 = () => (
    <form onSubmit={handleResetPassword} className="auth-form" style={{ width: '100%' }}>
      {errorMsg && (
        <div className="auth-error">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="auth-success">
          {successMsg}
        </div>
      )}
      
      <div className="auth-input-group">
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            required
            className="auth-input"
            style={{ 
              marginBottom: 16, 
              fontSize: 16, 
              padding: '12px 16px', 
              border: '1.5px solid #e0e7ef', 
              borderRadius: 12, 
              background: '#f8fafc', 
              color: '#222', 
              fontWeight: 500, 
              letterSpacing: '0.01em', 
              boxShadow: 'none', 
              outline: 'none', 
              transition: 'border 0.18s', 
              width: '100%' 
            }}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(v => !v)} 
            style={{ 
              position: 'absolute', 
              right: 14, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: 0, 
              margin: 0 
            }} 
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
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
      
      <div className="auth-input-group">
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="auth-input"
            style={{ 
              marginBottom: 16, 
              fontSize: 16, 
              padding: '12px 16px', 
              border: '1.5px solid #e0e7ef', 
              borderRadius: 12, 
              background: '#f8fafc', 
              color: '#222', 
              fontWeight: 500, 
              letterSpacing: '0.01em', 
              boxShadow: 'none', 
              outline: 'none', 
              transition: 'border 0.18s', 
              width: '100%' 
            }}
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        style={{ 
          width: '100%', 
          background: ACCENT, 
          color: 'white', 
          fontWeight: 700, 
          fontSize: 18, 
          border: 'none', 
          borderRadius: 22, 
          padding: '12px 0', 
          marginBottom: 8, 
          boxShadow: '0 2px 8px rgba(25,195,125,0.10)', 
          cursor: isResettingPassword ? 'not-allowed' : 'pointer', 
          transition: 'background 0.18s',
          opacity: isResettingPassword ? 0.7 : 1
        }}
        disabled={isResettingPassword}
      >
        {isResettingPassword ? 'RESETTING PASSWORD...' : 'RESET PASSWORD'}
      </button>
    </form>
  );

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
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: ACCENT, marginBottom: 8, fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>
              {step === 1 ? 'Reset Your Password' : step === 2 ? 'Verify Your Email' : 'Set New Password'}
            </h2>
            <p style={{ color: '#666', marginBottom: 24, fontSize: 16 }}>
              {step === 1 
                ? 'Enter your email address and we will send you a verification code' 
                : step === 2 
                ? 'Enter the 6-digit code sent to your email' 
                : 'Enter your new password below'}
            </p>
            
            {/* Progress indicator */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              {[1, 2, 3].map((num) => (
                <React.Fragment key={num}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: step >= num ? ACCENT : '#e0e7ef',
                    color: step >= num ? 'white' : '#999',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: 14
                  }}>
                    {num}
                  </div>
                  {num < 3 && (
                    <div style={{
                      height: 2,
                      flex: 1,
                      background: step > num ? ACCENT : '#e0e7ef',
                      margin: '0 8px'
                    }}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Render current step */}
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/login" style={{ color: ACCENT, fontWeight: 500, fontSize: 15, textDecoration: 'none' }}>
                ← Back to Login
              </Link>
            </div>
          </div>
          
          {/* Right: Accent Panel */}
          <div style={{ flex: 1, background: ACCENT, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', position: 'relative' }}>
            <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: 12, fontFamily: 'Inter, Poppins, Montserrat, sans-serif' }}>
              {step === 1 ? 'Forgot Password?' : step === 2 ? 'Verify Your Email' : 'Set New Password'}
            </h2>
            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 32, textAlign: 'center', opacity: 0.95 }}>
              {step === 1 
                ? 'Don\'t worry, it happens to everyone. We\'ll help you reset it.' 
                : step === 2 
                ? 'Protect your account with email verification.' 
                : 'Choose a strong password to keep your account secure.'}
            </div>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              {step === 1 ? (
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : step === 2 ? (
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;