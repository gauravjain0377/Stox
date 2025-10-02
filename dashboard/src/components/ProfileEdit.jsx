import React, { useState, useContext } from 'react';
import GeneralContext from './GeneralContext';
import { useAuth } from '../context/AuthContext';

const ProfileEdit = () => {
  const context = useContext(GeneralContext);
  const { setUser } = useAuth();
  const user = context.user || {};
  const [profile, setProfile] = useState({
    name: user?.username || '',
    email: user?.email || '',
    dob: user?.dateOfBirth || '',
    gender: user?.gender || '',
    mobile: user?.phone || '',
    clientCode: user?.clientCode || '',
    pan: user?.pan || '',
    maritalStatus: user?.maritalStatus || '',
    fatherName: user?.fatherName || '',
    demat: user?.demat || '',
    incomeRange: user?.incomeRange || '',
  });
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const storedUser = localStorage.getItem('user');
      const userObj = storedUser ? JSON.parse(storedUser) : context.user;
      const userId = userObj?.id || userObj?.userId;
      if (!userId) throw new Error('Missing user id');

      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profile.name,
          email: profile.email,
          dateOfBirth: profile.dob,
          gender: profile.gender,
          phone: profile.mobile,
          clientCode: profile.clientCode,
          pan: profile.pan,
          maritalStatus: profile.maritalStatus,
          fatherName: profile.fatherName,
          demat: profile.demat,
          incomeRange: profile.incomeRange,
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update');

      // Update auth context and localStorage
      const updatedUserForAuth = {
        id: data.user.id,
        name: data.user.username,
        email: data.user.email
      };
      localStorage.setItem('user', JSON.stringify(updatedUserForAuth));
      setUser(updatedUserForAuth);

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 1500);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSuccess('Failed to update profile');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="name" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
            <input name="pan" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.pan} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (DD/MM/YYYY)</label>
            <input name="dob" type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.dob} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input name="mobile" type="tel" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.mobile} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
            <select name="maritalStatus" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.maritalStatus} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unique Client Code</label>
            <input name="clientCode" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100" value={profile.clientCode} readOnly />
            <p className="text-xs text-gray-500 mt-1">Auto-generated and unique for your account.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
            <input name="fatherName" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.fatherName} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Demat Acc Number / BOID</label>
            <input name="demat" type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.demat} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Income Range</label>
            <select name="incomeRange" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={profile.incomeRange} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Below 1 Lac">Below 1 Lac</option>
              <option value="1-5 Lac">1-5 Lac</option>
              <option value="5-10 Lac">5-10 Lac</option>
              <option value="10-25 Lac">10-25 Lac</option>
              <option value=">25 Lac">Above 25 Lac</option>
            </select>
          </div>
        </div>
        <button type="submit" className="mt-8 w-full bg-indigo-700 text-white py-2 rounded-lg font-semibold hover:bg-indigo-800 transition">Save Changes</button>
        {success && <div className="text-green-600 text-center mt-4">{success}</div>}
      </form>
    </div>
  );
};

export default ProfileEdit; 