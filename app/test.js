// /app/test.js (temporary - rename your current page.js to page-old.js)
'use client';

import { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    console.log('TestPage: Component mounted');
    console.log('LocalStorage user:', localStorage.getItem('user'));
    console.log('Current URL:', window.location.href);
  }, []);

  const handleLogin = () => {
    const testUser = {
      id: "EMP001",
      name: "John Doe",
      email: "john.doe@novatech.com",
      role: "agent",
      department: "Engineering",
      shift: "9:00 AM - 6:00 PM",
      phone: "+1-555-0101"
    };
    
    localStorage.setItem('user', JSON.stringify(testUser));
    console.log('Test user set in localStorage');
    alert('Test user set. Reload the page.');
    window.location.reload();
  };

  const handleClear = () => {
    localStorage.clear();
    console.log('LocalStorage cleared');
    alert('LocalStorage cleared. Reload the page.');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Test Page</h1>
        <p className="text-gray-400">Checking AuthContext issues</p>
        
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            className="block w-64 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
          >
            Set Test User in localStorage
          </button>
          
          <button
            onClick={handleClear}
            className="block w-64 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
          >
            Clear localStorage
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="block w-64 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
          >
            Go to Main Page
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">Debug Info:</p>
          <pre className="text-xs text-left mt-2 overflow-auto max-h-40">
            {JSON.stringify({
              user: localStorage.getItem('user'),
              timestamp: new Date().toISOString(),
              pathname: window.location.pathname
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}