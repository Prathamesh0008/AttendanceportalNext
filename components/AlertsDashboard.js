'use client';

import { Bell, Clock, X, AlertCircle, CheckCircle } from 'lucide-react';

const AlertsDashboard = ({ 
  alerts,
  setAlerts,
  shiftStarted,
  shiftStartTime,
  totalBreakTime,
  activeBreak,
  empId,
  myProjects
}) => {
  return (
    <div className="space-y-6">
      {/* Alerts Dashboard */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm h-full">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-amber-400" />
            Recent Alerts
          </h3>
          {alerts.length > 0 && (
            <button
              onClick={() => setAlerts([])}
              className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-2 py-1 rounded-lg transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-700" />
            <p className="text-gray-500">No alerts yet</p>
            <p className="text-sm text-gray-600 mt-1">Your alerts will appear here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border ${
                  alert.type === 'warning'
                    ? 'bg-gradient-to-r from-red-900/20 to-red-800/10 border-red-800/30'
                    : alert.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-900/20 to-emerald-800/10 border-emerald-800/30'
                    : 'bg-gradient-to-r from-blue-900/20 to-blue-800/10 border-blue-800/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      {alert.type === 'warning' && <AlertCircle className="w-4 h-4 text-red-400 mr-2" />}
                      {alert.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 mr-2" />}
                      <p className={`font-medium ${
                        alert.type === 'warning' ? 'text-red-300' : 
                        alert.type === 'success' ? 'text-emerald-300' : 
                        'text-blue-300'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <button
                    onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                    className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Card */}
      {shiftStarted && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Shift Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Shift Started</span>
              <span className="font-semibold text-white">
                {shiftStartTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Breaks</span>
              <span className="font-semibold text-white">{totalBreakTime} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Breaks</span>
              <span className="font-semibold text-white">{activeBreak ? 1 : 0}</span>
            </div>
            
            {empId && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">My Projects</span>
                <span className="font-semibold text-white">{myProjects.length}</span>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Time</span>
                <span className="font-bold text-blue-400">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsDashboard;