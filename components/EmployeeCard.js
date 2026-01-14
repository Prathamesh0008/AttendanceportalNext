// /components/EmployeeCard.js
'use client';

import { Play, Pause, User, Clock, AlertCircle } from 'lucide-react';

export default function EmployeeCard({ user, shiftStarted, setShiftStarted }) {
  const handleStartShift = () => {
    const confirmStart = window.confirm(`Start shift for ${user?.name}?\nTime: ${new Date().toLocaleTimeString()}`);
    if (confirmStart) {
      setShiftStarted(true);
      alert(`✅ Shift started at ${new Date().toLocaleTimeString()}`);
    }
  };

  const handleEndShift = () => {
    const confirmEnd = window.confirm(`End shift for ${user?.name}?\nTime: ${new Date().toLocaleTimeString()}`);
    if (confirmEnd) {
      setShiftStarted(false);
      alert(`✅ Shift ended at ${new Date().toLocaleTimeString()}`);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Shift Control Panel</h2>
            <p className="text-sm text-gray-400">Manage your work attendance</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Shift Control */}
      <div className="space-y-4">
        <div className="flex space-x-3">
          {!shiftStarted ? (
            <button
              onClick={handleStartShift}
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-medium bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="w-5 h-5" />
              <span>Start Shift</span>
            </button>
          ) : (
            <button
              onClick={handleEndShift}
              className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-medium bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Pause className="w-5 h-5" />
              <span>End Shift</span>
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-center">
          <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
            shiftStarted 
              ? 'bg-green-900/30 text-green-400 border border-green-800' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}>
            {shiftStarted ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Shift Active</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span>Shift Not Started</span>
              </>
            )}
          </div>
        </div>

        {/* Warning if shift active */}
        {shiftStarted && (
          <div className="p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-300">
                Your shift is active. Remember to take breaks and log your tasks.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}