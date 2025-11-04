import React, { useState, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Settings.css";
import { getApiUrl } from '../config/api';

const Settings = ({ user }) => {
  const context = useContext(GeneralContext);
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || context.user?.firstName || "",
    lastName: user?.lastName || context.user?.lastName || "",
    email: user?.email || context.user?.email || "",
    phone: user?.phone || context.user?.phone || "",
    dateOfBirth: user?.dateOfBirth || context.user?.dateOfBirth || "",
    address: user?.address || context.user?.address || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    tradeConfirmations: true
  });

  const [linkedAccounts, setLinkedAccounts] = useState({
    google: { linked: true, email: "john.doe@gmail.com" },
    phone: { linked: true, number: "+91 98765 43210" },
    bank: { linked: false, account: "" }
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "profile", label: "Edit Profile", icon: "👤" },
    { id: "security", label: "Account Settings", icon: "🔒" },
    { id: "notifications", label: "Privacy & Security", icon: "🔔" },
    { id: "support", label: "Help & Support", icon: "❓" }
  ];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match!" });
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Password changed successfully!" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to change password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityToggle = async (setting) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSecuritySettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
      setMessage({ type: "success", text: `${setting} updated successfully!` });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update setting. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (!window.confirm("Are you sure you want to logout from all devices? This will require you to login again on all devices.")) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Logged out from all devices successfully!" });
      // In real app, this would redirect to login
    } catch (error) {
      setMessage({ type: "error", text: "Failed to logout from all devices. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const renderOverviewTab = () => (
    <div className="settings-content overview-content">
      <div className="overview-card">
        <div className="overview-section-title">PERSONAL INFORMATION</div>
        <div className="overview-info-row">
          <span className="overview-info-label">👤</span>
          <span>{user?.username || user?.email || 'User'}</span>
          <span className="overview-info-label">✉️</span>
          <span>{user?.email}</span>
        </div>
        {/* Add more info as needed */}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Profile Settings</h2>
        <p>Update your personal information and account details</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="settings-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={profileForm.firstName}
              onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={profileForm.dateOfBirth}
              onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={profileForm.address}
              onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
              rows="3"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Security Settings</h2>
        <p>Manage your account security and authentication settings</p>
      </div>

      <div className="settings-section">
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      <div className="settings-section">
        <h3>Two-Factor Authentication</h3>
        <div className="toggle-section">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Email OTP</h4>
              <p>Receive one-time passwords via email for additional security</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorEnabled}
                onChange={() => handleSecurityToggle('twoFactorEnabled')}
                disabled={isLoading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Account Security</h3>
        <div className="security-actions">
          <button 
            onClick={handleLogoutAllDevices}
            className="btn-danger"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Logout from All Devices"}
          </button>
          <p className="security-note">
            This will sign you out from all devices and require you to login again
          </p>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Notification Preferences</h2>
        <p>Choose how and when you want to receive notifications</p>
      </div>

      <div className="settings-section">
        <h3>Notification Channels</h3>
        <div className="toggle-section">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Email Notifications</h4>
              <p>Receive important updates and alerts via email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={securitySettings.emailNotifications}
                onChange={() => handleSecurityToggle('emailNotifications')}
                disabled={isLoading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>SMS Notifications</h4>
              <p>Get critical alerts and security codes via SMS</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={securitySettings.smsNotifications}
                onChange={() => handleSecurityToggle('smsNotifications')}
                disabled={isLoading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Alert Types</h3>
        <div className="toggle-section">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Login Alerts</h4>
              <p>Get notified when someone logs into your account</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={securitySettings.loginAlerts}
                onChange={() => handleSecurityToggle('loginAlerts')}
                disabled={isLoading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Trade Confirmations</h4>
              <p>Receive confirmations for all your trades</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={securitySettings.tradeConfirmations}
                onChange={() => handleSecurityToggle('tradeConfirmations')}
                disabled={isLoading}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountsTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Linked Accounts</h2>
        <p>Manage your connected accounts and external services</p>
      </div>

      <div className="settings-section">
        <div className="linked-accounts">
          <div className="account-item">
            <div className="account-info">
              <div className="account-icon">🔍</div>
              <div className="account-details">
                <h4>Google Account</h4>
                <p>{linkedAccounts.google.email}</p>
              </div>
            </div>
            <div className="account-status">
              <span className={`status-badge ${linkedAccounts.google.linked ? 'connected' : 'disconnected'}`}>
                {linkedAccounts.google.linked ? 'Connected' : 'Disconnected'}
              </span>
              <button className="btn-link">
                {linkedAccounts.google.linked ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>

          <div className="account-item">
            <div className="account-info">
              <div className="account-icon">📱</div>
              <div className="account-details">
                <h4>Phone Number</h4>
                <p>{linkedAccounts.phone.number}</p>
              </div>
            </div>
            <div className="account-status">
              <span className={`status-badge ${linkedAccounts.phone.linked ? 'connected' : 'disconnected'}`}>
                {linkedAccounts.phone.linked ? 'Verified' : 'Unverified'}
              </span>
              <button className="btn-link">
                {linkedAccounts.phone.linked ? 'Change' : 'Verify'}
              </button>
            </div>
          </div>

          <div className="account-item">
            <div className="account-info">
              <div className="account-icon">🏦</div>
              <div className="account-details">
                <h4>Bank Account</h4>
                <p>{linkedAccounts.bank.linked ? '****1234' : 'Not linked'}</p>
              </div>
            </div>
            <div className="account-status">
              <span className={`status-badge ${linkedAccounts.bank.linked ? 'connected' : 'disconnected'}`}>
                {linkedAccounts.bank.linked ? 'Connected' : 'Not Linked'}
              </span>
              <button className="btn-link">
                {linkedAccounts.bank.linked ? 'Manage' : 'Link Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Preferences</h2>
        <p>Customize your trading experience and app settings</p>
      </div>

      <div className="settings-section">
        <h3>Display Settings</h3>
        <div className="preference-item">
          <label htmlFor="theme">Theme</label>
          <select 
            id="theme" 
            className="form-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="preference-item">
          <label htmlFor="currency">Default Currency</label>
          <select id="currency" className="form-select">
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>

        <div className="preference-item">
          <label htmlFor="timezone">Time Zone</label>
          <select id="timezone" className="form-select">
            <option value="IST">India Standard Time (IST)</option>
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Standard Time (EST)</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h3>Trading Preferences</h3>
        <div className="toggle-section">
          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Auto-confirm Orders</h4>
              <p>Automatically confirm orders without additional prompts</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <h4>Show Advanced Charts</h4>
              <p>Display advanced charting tools and indicators</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSupportTab = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Help & Support</h2>
        <p>Contact us or check the FAQs below.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="text-sm text-gray-600">Support email</div>
        <div className="text-lg font-semibold text-gray-900">gjain0229@gmail.com</div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          setMessage({ type: "", text: "" });
          const form = e.target;
          const payload = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            purpose: form.purpose.value,
            message: form.message.value,
          };
          try {
            const apiUrl = getApiUrl('/api/support/contact');
            console.log('📧 [FRONTEND] Sending email request to:', apiUrl);
            console.log('📧 [FRONTEND] Request payload:', { ...payload, message: payload.message.substring(0, 50) + '...' });
            
            const res = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            console.log('📧 [FRONTEND] Response status:', res.status, res.statusText);
            
            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              const text = await res.text();
              console.error('📧 [FRONTEND] Non-JSON response:', text);
              throw new Error(`Server returned ${res.status}: ${text.substring(0, 100)}`);
            }
            
            const data = await res.json();
            console.log('📧 [FRONTEND] Response data:', data);
            
            if (!res.ok || !data.success) {
              throw new Error(data.message || 'Failed to send');
            }
            setMessage({ type: 'success', text: data.message || 'Message sent successfully' });
            form.reset();
          } catch (err) {
            console.error('📧 [FRONTEND] Error sending email:', err);
            console.error('📧 [FRONTEND] Error details:', {
              name: err.name,
              message: err.message,
              stack: err.stack
            });
            setMessage({ type: 'error', text: err.message || 'Failed to send message. Please check your connection and try again.' });
          }
          setIsLoading(false);
        }}
        className="settings-form"
      >
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input id="name" name="name" type="text" required defaultValue={context.user?.username || ''} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input id="email" name="email" type="email" required defaultValue={context.user?.email || ''} />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" type="text" placeholder="Short summary" />
          </div>
          <div className="form-group">
            <label htmlFor="purpose">Purpose</label>
            <select id="purpose" name="purpose">
              <option>General inquiry</option>
              <option>Login issue</option>
              <option>Orders</option>
              <option>Funds</option>
              <option>Positions</option>
              <option>Bug report</option>
              <option>Feature request</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" placeholder="Describe your issue or request" required></textarea>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send Message'}</button>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "profile":
        return renderProfileTab();
      case "security":
        return renderSecurityTab();
      case "notifications":
        return renderNotificationsTab();
      case "support":
        return renderSupportTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="settings-modal-inner">
      <div className="settings-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`settings-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      {message.text && (
        <div className={`settings-message${message.type === 'error' ? ' error' : ''}`}>{message.text}</div>
      )}
      {renderContent()}
    </div>
  );
};

export default Settings; 