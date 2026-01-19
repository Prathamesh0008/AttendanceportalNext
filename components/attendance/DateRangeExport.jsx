// /components/attendance/DateRangeExport.jsx
'use client';

import { useState } from 'react';
import { exportDateRangeToExcel } from '@/utils/excelExport';

export const DateRangeExport = ({ className = '' }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date.');
      return;
    }

    setIsExporting(true);
    
    try {
      const success = await exportDateRangeToExcel(startDate, endDate, 'attendance_report');
      if (success) {
        setStartDate('');
        setEndDate('');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Set today's date by default
  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  };

  // Set yesterday's date
  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    setStartDate(yesterdayStr);
    setEndDate(yesterdayStr);
  };

  // Set this week
  const setThisWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday
    
    setStartDate(startOfWeek.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Custom Date Range</h3>
      
      <div className="space-y-4">
        {/* Quick Date Presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={setToday}
            className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-md hover:bg-green-100 transition-colors border border-green-200"
          >
            Today
          </button>
          <button
            type="button"
            onClick={setYesterday}
            className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-sm rounded-md hover:bg-yellow-100 transition-colors border border-yellow-200"
          >
            Yesterday
          </button>
          <button
            type="button"
            onClick={setThisWeek}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
          >
            This Week
          </button>
        </div>
        
        {/* Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting || !startDate || !endDate}
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>
            {isExporting 
              ? 'Exporting...' 
              : `Export Data ${startDate && endDate ? `(${startDate} to ${endDate})` : ''}`}
          </span>
        </button>
      </div>
    </div>
  );
};