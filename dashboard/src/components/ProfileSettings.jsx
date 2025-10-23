import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
const strengthColors = ['bg-gray-300', 'bg-red-400', 'bg-yellow-400', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];

const ProfileSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [successAnim, setSuccessAnim] = useState(false);

  const strength = getPasswordStrength(passwordForm.newPassword);
  const passwordsMatch = passwordForm.newPassword === passwordForm.confirmPassword;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setSuccessAnim(false);
    
    if (!user?.email) {
      setMessage({ type: 'error', text: 'User email not found. Please re-login.' });
      setIsLoading(false);
      return;
    }
    
    if (!passwordsMatch) {
      setMessage({ type: 'error', text: "New passwords don't match!" });
      setIsLoading(false);
      return;
    }
    if (strength < 3) {
      setMessage({ type: 'error', text: 'Please choose a stronger password.' });
      setIsLoading(false);
      return;
    }
    try {
      const res = await axios.post(getApiUrl('/api/users/change-password'), {
        email: user.email,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, { withCredentials: true });
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSuccessAnim(true);
        setTimeout(() => setSuccessAnim(false), 2000);
      } else {
        setMessage({ type: 'error', text: res.data.message || 'Failed to change password.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    }
    setIsLoading(false);
  };

  const handleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-green-50 flex items-center justify-center py-8">
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-xl animate-fade-in relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-900">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></span>
              <input
                type={showPassword.current ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                required
                aria-label="Current Password"
              />
              <button type="button" aria-label="Show/Hide Password" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => handleShowPassword('current')}>
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></span>
              <input
                type={showPassword.new ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                required
                aria-label="New Password"
              />
              <button type="button" aria-label="Show/Hide Password" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => handleShowPassword('new')}>
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className={`h-2 w-24 rounded-full ${strengthColors[strength]}`}></div>
              <span className={`text-xs font-medium ${strength >= 4 ? 'text-green-700' : 'text-gray-500'}`}>{strengthLabels[strength]}</span>
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></span>
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                className="w-full border border-gray-300 rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                required
                aria-label="Confirm New Password"
              />
              <button type="button" aria-label="Show/Hide Password" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => handleShowPassword('confirm')}>
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordForm.confirmPassword && !passwordsMatch && (
              <div className="text-xs text-red-600 mt-1">Passwords do not match</div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-800 transition"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
          {message.text && (
            <div className={`text-center mt-4 ${message.type === 'error' && message.text === 'Current password is incorrect' ? 'bg-red-600 text-white py-2 rounded flex items-center justify-center gap-2' : message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.type === 'error' && message.text === 'Current password is incorrect' ? (<><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{message.text}</>) : message.text}</div>
          )}
          {successAnim && (
            <div className="flex justify-center mt-6 animate-bounce">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l2 2 4-4" />
              </svg>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings; 