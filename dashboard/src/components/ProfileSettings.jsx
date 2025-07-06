import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GeneralContext from './GeneralContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Settings.css';

const tabs = [
  { label: 'All Orders', value: 'orders' },
  { label: 'Edit Profile', value: 'edit' },
  { label: 'Privacy & Security', value: 'privacy' },
  { label: 'Help & Support', value: 'support' },
];

function getTabFromQuery(search) {
  const params = new URLSearchParams(search);
  return params.get('tab') || 'orders';
}

const ProfileSettings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(GeneralContext);
  const { theme, setTheme } = useTheme();
  const activeTab = getTabFromQuery(location.search);
  const user = context.user || {};

  // State from Settings.jsx
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    tradeConfirmations: true
  });

  // Handlers from Settings.jsx
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: "New passwords don't match!" });
      setIsLoading(false);
      return;
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  const handleSecurityToggle = async (setting) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSecuritySettings(prev => ({ ...prev, [setting]: !prev[setting] }));
      setMessage({ type: 'success', text: `${setting} updated successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update setting. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogoutAllDevices = async () => {
    if (!window.confirm('Are you sure you want to logout from all devices? This will require you to login again on all devices.')) return;
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Logged out from all devices successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to logout from all devices. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Tab content renderers
  const renderEditProfileTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Profile Settings</h2>
        <p>Update your personal information and account details</p>
      </div>
      <form onSubmit={handleProfileSubmit} className="settings-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" value={profileForm.firstName} onChange={e => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" value={profileForm.lastName} onChange={e => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" value={profileForm.email} onChange={e => setProfileForm(prev => ({ ...prev, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" value={profileForm.phone} onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input type="date" id="dateOfBirth" value={profileForm.dateOfBirth} onChange={e => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))} required />
          </div>
          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <textarea id="address" value={profileForm.address} onChange={e => setProfileForm(prev => ({ ...prev, address: e.target.value }))} rows="3" required />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Updating...' : 'Update Profile'}</button>
        </div>
      </form>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Privacy & Security</h2>
        <p>Manage your account security, authentication, and notification settings</p>
      </div>
      {/* Security Settings */}
      <div className="settings-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" value={passwordForm.currentPassword} onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" value={passwordForm.newPassword} onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Changing...' : 'Change Password'}</button>
          </div>
        </form>
      </div>
      {/* Two-Factor Authentication */}
      <div className="settings-section">
        <h3>Two-Factor Authentication</h3>
        <div className="toggle-section">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Email OTP</h4>
              <p>Receive one-time passwords via email for additional security</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={securitySettings.twoFactorEnabled} onChange={() => handleSecurityToggle('twoFactorEnabled')} disabled={isLoading} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      {/* Account Security */}
      <div className="settings-section">
        <h3>Account Security</h3>
        <div className="security-actions">
          <button onClick={handleLogoutAllDevices} className="btn-danger" disabled={isLoading}>{isLoading ? 'Processing...' : 'Logout from All Devices'}</button>
          <p className="security-note">This will sign you out from all devices and require you to login again</p>
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="settings-section">
        <h3>Notification Preferences</h3>
        <div className="toggle-section">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Email Notifications</h4>
              <p>Receive important updates and alerts via email</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={securitySettings.emailNotifications} onChange={() => handleSecurityToggle('emailNotifications')} disabled={isLoading} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>SMS Notifications</h4>
              <p>Get critical alerts and security codes via SMS</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={securitySettings.smsNotifications} onChange={() => handleSecurityToggle('smsNotifications')} disabled={isLoading} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      {/* Alert Types */}
      <div className="settings-section">
        <h3>Alert Types</h3>
        <div className="toggle-section">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Login Alerts</h4>
              <p>Get notified when someone logs into your account</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={securitySettings.loginAlerts} onChange={() => handleSecurityToggle('loginAlerts')} disabled={isLoading} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Trade Confirmations</h4>
              <p>Receive confirmations for all your trades</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={securitySettings.tradeConfirmations} onChange={() => handleSecurityToggle('tradeConfirmations')} disabled={isLoading} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      <div className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          tab.value === 'orders' ? (
            <button
              key={tab.value}
              onClick={() => navigate('/orders')}
              className={`px-5 py-2 rounded-lg border text-base font-medium transition-all duration-150 ${
                activeTab === tab.value
                  ? 'bg-indigo-900 text-white border-indigo-900'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ) : (
            <button
              key={tab.value}
              onClick={() => navigate(`/profile/settings?tab=${tab.value}`)}
              className={`px-5 py-2 rounded-lg border text-base font-medium transition-all duration-150 ${
                activeTab === tab.value
                  ? 'bg-indigo-900 text-white border-indigo-900'
                  : 'bg-white text-black border-gray-300 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          )
        ))}
      </div>
      {message.text && (
        <div className={`settings-message${message.type === 'error' ? ' error' : ''}`}>{message.text}</div>
      )}
      <div className="min-h-[120px]">
        {activeTab === 'edit' && renderEditProfileTab()}
        {activeTab === 'privacy' && renderPrivacyTab()}
        {activeTab === 'support' && <div className="settings-content">Help & Support coming soon.</div>}
      </div>
    </div>
  );
};

export default ProfileSettings; 