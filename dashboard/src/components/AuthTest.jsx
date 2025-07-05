import React, { useEffect, useState } from 'react';

const AuthTest = () => {
  const [authData, setAuthData] = useState({});

  useEffect(() => {
    const checkAuth = () => {
      // Check URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      const urlUser = urlParams.get('user');
      const urlIsLoggedIn = urlParams.get('isLoggedIn');
      
      // Then check localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      setAuthData({
        token: token ? 'EXISTS' : 'MISSING',
        tokenValue: token,
        userData: userData ? 'EXISTS' : 'MISSING',
        isLoggedIn: isLoggedIn,
        rawUserData: userData,
        urlToken: urlToken ? 'EXISTS' : 'MISSING',
        urlUser: urlUser ? 'EXISTS' : 'MISSING',
        urlIsLoggedIn: urlIsLoggedIn
      });
    };

    checkAuth();
    // Check every second
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      border: '1px solid #ccc'
    }}>
      <h4>Auth Debug</h4>
      <div style={{fontSize: '11px', marginBottom: '5px'}}>
        <strong>URL Params:</strong>
        <div>Token: {authData.urlToken}</div>
        <div>User: {authData.urlUser}</div>
        <div>Login: {authData.urlIsLoggedIn}</div>
      </div>
      <div style={{fontSize: '11px', marginBottom: '5px'}}>
        <strong>localStorage:</strong>
        <div>Token: {authData.token}</div>
        <div>User Data: {authData.userData}</div>
        <div>Is Logged In: {authData.isLoggedIn}</div>
      </div>
      {authData.tokenValue && (
        <div style={{fontSize: '10px', wordBreak: 'break-all'}}>
          Token Value: {authData.tokenValue.substring(0, 20)}...
        </div>
      )}
      {authData.rawUserData && (
        <div>
          <strong>Raw User Data:</strong>
          <pre style={{fontSize: '10px', margin: '5px 0'}}>
            {authData.rawUserData}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AuthTest; 