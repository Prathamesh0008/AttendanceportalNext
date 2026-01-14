// /components/Login.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { employees } from '@/utils/constants';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(employeeId, password);
    
    if (result.success) {
      // Login successful - context will update
    } else {
      setError(result.message || 'Invalid credentials');
    }
    
    setLoading(false);
  };

  const handleQuickLogin = (empId) => {
    const employee = employees.find(emp => emp.id === empId);
    if (employee) {
      setEmployeeId(empId);
      setPassword(employee.password);
      
      // Auto-submit after a short delay
      setTimeout(() => {
        const result = login(empId, employee.password);
        if (!result.success) {
          setError('Quick login failed');
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Nova TechSciences
          </h1>
          <p className="text-gray-400 mt-2">Attendance & Project Management Portal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Login Form */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Portal Login</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Employee ID
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="NTS-001"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  loading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? 'Authenticating...' : 'Login to Portal'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">Quick Login (Team Members)</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickLogin('NTS-MGR')}
                  className="py-2 px-3 bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-800 hover:to-purple-700 text-white rounded-lg font-medium transition-all text-xs text-center"
                >
                  Manager Login
                </button>
                <button
                  onClick={() => handleQuickLogin('NTS-001')}
                  className="py-2 px-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-all text-xs text-center"
                >
                  Prathamesh (Agent)
                </button>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Nova TechSciences Team</h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {employees.map((employee) => (
                <div 
                  key={employee.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer hover:scale-[1.02] ${
                    employee.role === 'manager'
                      ? 'bg-purple-900/20 border-purple-800/50 hover:bg-purple-900/30'
                      : 'bg-gray-900/30 border-gray-700 hover:bg-gray-900/50'
                  }`}
                  onClick={() => handleQuickLogin(employee.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">{employee.name}</p>
                        {employee.role === 'manager' && (
                          <span className="px-2 py-0.5 bg-purple-900/50 text-purple-300 text-xs rounded-full border border-purple-800">
                            Manager
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{employee.id} • {employee.shift}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{employee.department}</p>
                      <p className="text-xs text-gray-500">Click to login</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                All passwords are: username123 (e.g., prathamesh123, adarsh123)
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Manager password: manager123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}