import React, { useContext } from 'react';
import GeneralContext from './GeneralContext';

const ProfileOverview = () => {
  const context = useContext(GeneralContext);
  const user = context.user || {};
  const initials = (user?.username || user?.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-green-400 flex items-center justify-center text-white text-3xl font-bold mb-2 shadow-lg">
          {initials}
        </div>
        <div className="text-2xl font-bold text-gray-900">{user?.username || 'User'}</div>
        <div className="text-gray-500 text-sm">{user?.email}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs text-gray-400 mb-1">DATE OF BIRTH</div>
          <div className="font-medium text-gray-800 mb-4">{user?.dateOfBirth || '--'}</div>
          <div className="text-xs text-gray-400 mb-1">MOBILE NUMBER</div>
          <div className="font-medium text-gray-800 mb-4">{user?.phone || '--'}</div>
          <div className="text-xs text-gray-400 mb-1">Father's Name</div>
          <div className="font-medium text-gray-800 mb-4">{user?.fatherName || '--'}</div>
          <div className="text-xs text-gray-400 mb-1">Demat Acc Number / BOID</div>
          <div className="font-medium text-gray-800 mb-4">{user?.demat || '--'}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">PAN</div>
          <div className="font-medium text-gray-800 mb-4">{user?.pan || '--'}</div>
          <div className="text-xs text-gray-400 mb-1">GENDER</div>
          <div className="font-medium text-gray-800 mb-4">{user?.gender || '--'}</div>
          <div className="text-xs text-gray-400 mb-1">MARITAL STATUS</div>
          <div className="font-medium text-gray-800 mb-4">{user?.maritalStatus || '--'}</div>
          <div className="text-xs text-gray-400 mb-1">UNIQUE CLIENT CODE</div>
          <div className="font-medium text-gray-800 mb-4">{user?.clientCode || '5384621902'}</div>
          <div className="text-xs text-gray-400 mb-1">INCOME RANGE</div>
          <div className="font-medium text-gray-800 mb-4">{user?.incomeRange || '--'}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview; 