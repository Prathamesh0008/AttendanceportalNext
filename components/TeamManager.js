// /components/TeamManager.js
'use client';

import { Users, Clock, CheckCircle, XCircle, TrendingUp, Mail } from 'lucide-react';
import { employees } from '@/utils/constants';

export default function TeamManager({ attendanceData = [] }) {
  // Calculate attendance stats
  const activeShifts = attendanceData.filter(record => 
    record.status === 'Active'
  ).length;

  const completedToday = attendanceData.filter(record => {
    const today = new Date().toISOString().split('T')[0];
    return record.date === today && record.status === 'Completed';
  }).length;

  const onLeave = 0; // You can add leave tracking later

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Team Management</h2>
            <p className="text-sm text-gray-400">Monitor team attendance & performance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{employees.length}</p>
          <p className="text-xs text-gray-400">Total Members</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Active Now</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeShifts}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Completed Today</span>
          </div>
          <p className="text-2xl font-bold text-white">{completedToday}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">On Leave</span>
          </div>
          <p className="text-2xl font-bold text-white">{onLeave}</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Attendance %</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {employees.length > 0 ? Math.round((completedToday / employees.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Team List */}
      <div className="space-y-3">
        <h3 className="font-medium text-gray-300 mb-2">Team Members</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {employees.map((employee) => {
            const todayRecord = attendanceData.find(record => 
              record.employeeId === employee.id && 
              record.date === new Date().toISOString().split('T')[0]
            );
            
            return (
              <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center text-xs font-bold">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{employee.name}</p>
                    <p className="text-xs text-gray-400">{employee.id} • {employee.shift}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`px-2 py-1 rounded text-xs ${
                    todayRecord?.status === 'Active' 
                      ? 'bg-green-900/30 text-green-400 border border-green-800' 
                      : todayRecord?.status === 'Completed'
                      ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}>
                    {todayRecord?.status || 'Not Started'}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {todayRecord?.startTime 
                      ? new Date(todayRecord.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '--:--'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <h3 className="font-medium text-gray-300 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg font-medium transition-all text-sm flex items-center justify-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Email Team</span>
          </button>
          <button className="py-2 px-4 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-lg font-medium transition-all text-sm flex items-center justify-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}