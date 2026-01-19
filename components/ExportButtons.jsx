// /components/attendance/ExportButtons.jsx
'use client';

import { useState } from 'react';
import { exportToExcelFromFirebase, fetchTodaysAttendance } from '@/utils/excelExport';

export const TodaysExportButton = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const success = await exportToExcelFromFirebase('today_attendance');
      if (success) {
        console.log('Export successful!');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-lg font-medium flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span>📊</span>
      <span>
        {isExporting ? 'Exporting...' : "Export Today's Data"}
      </span>
    </button>
  );
};

export const AllDataExportButton = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const success = await exportToExcelFromFirebase('all_attendance_records');
      if (success) {
        console.log('Export successful!');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span>📁</span>
      <span>
        {isExporting ? 'Exporting...' : 'Export All Data'}
      </span>
    </button>
  );
};

export const Last7DaysExportButton = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      
      const success = await exportToExcelFromFirebase(
        'last_7_days_attendance',
        startStr,
        endStr
      );
      
      if (success) {
        console.log('Export successful!');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg font-medium flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <span>📅</span>
      <span>
        {isExporting ? 'Exporting...' : 'Last 7 Days'}
      </span>
    </button>
  );
};