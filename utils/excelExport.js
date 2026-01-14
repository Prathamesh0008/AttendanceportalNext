// /utils/excelExport.js
import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName = 'attendance_report') => {
  const workbook = XLSX.utils.book_new();
  
  // Process your data format (SHIFT_START and SHIFT_END events)
  const processedData = processAttendanceEvents(data);
  
  // Format data for Excel
  const formattedData = processedData.map(record => ({
    'Employee ID': record.employeeId,
    'Employee Name': record.employeeName,
    'Email': record.employeeEmail || '',
    'Date': record.date ? formatDate(record.date) : 'N/A',
    'Login Time': record.startTime ? formatTime(record.startTime) : 'N/A',
    'Login Date & Time': record.startTime ? formatDateTime(record.startTime) : 'N/A',
    'Logout Time': record.endTime ? formatTime(record.endTime) : 'N/A',
    'Logout Date & Time': record.endTime ? formatDateTime(record.endTime) : 'N/A',
    'Shift Duration': record.endTime ? calculateDuration(record.startTime, record.endTime) : 'In Progress',
    'Working Hours': record.workingHours ? `${parseFloat(record.workingHours).toFixed(2)} hours` : '0.00',
    'Break Time': `${record.totalBreakTime || 0} minutes`,
    'Status': record.status || 'N/A',
    'Breaks Taken': record.breaks ? record.breaks.length : 0,
    'Event Type': record.eventType || 'Shift',
    'Remarks': record.remarks || '',
    'Created At': record.createdAt ? formatDateTime(record.createdAt) : formatDateTime(new Date())
  }));

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Add column widths
  worksheet['!cols'] = [
    { wch: 12 }, // Employee ID
    { wch: 20 }, // Employee Name
    { wch: 25 }, // Email
    { wch: 12 }, // Date
    { wch: 12 }, // Login Time
    { wch: 20 }, // Login Date & Time
    { wch: 12 }, // Logout Time
    { wch: 20 }, // Logout Date & Time
    { wch: 15 }, // Shift Duration
    { wch: 15 }, // Working Hours
    { wch: 15 }, // Break Time
    { wch: 12 }, // Status
    { wch: 12 }, // Breaks Taken
    { wch: 15 }, // Event Type
    { wch: 25 }, // Remarks
    { wch: 20 }, // Created At
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

  // Add summary sheet
  const summaryData = generateSummary(processedData);
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [
    { wch: 30 }, // Metric
    { wch: 30 }, // Value
    { wch: 40 }, // Details
  ];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  // Add daily attendance sheet
  const dailyData = generateDailyAttendance(processedData);
  const dailySheet = XLSX.utils.json_to_sheet(dailyData);
  dailySheet['!cols'] = [
    { wch: 12 }, // Employee ID
    { wch: 20 }, // Employee Name
    { wch: 12 }, // Date
    { wch: 12 }, // Login
    { wch: 12 }, // Logout
    { wch: 15 }, // Duration
    { wch: 10 }, // Status
  ];
  XLSX.utils.book_append_sheet(workbook, dailySheet, 'Daily Attendance');

  // Save file
  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `${fileName}_${today}.xlsx`);
};

// Process your event-based data into complete records
const processAttendanceEvents = (data) => {
  const records = [];
  const today = new Date().toISOString().split('T')[0];
  
  // Group events by employee and date
  const eventsByEmployee = {};
  
  data.forEach(event => {
    const date = event.date || today;
    const key = `${event.employeeId}_${date}`;
    
    if (!eventsByEmployee[key]) {
      eventsByEmployee[key] = {
        employeeId: event.employeeId,
        employeeName: event.employeeName,
        employeeEmail: event.employeeEmail,
        date: date,
        events: []
      };
    }
    
    eventsByEmployee[key].events.push({
      type: event.eventType,
      time: event.timestamp || event.createdAt || new Date().toISOString(),
      workingHours: event.workingHours,
      totalBreakTime: event.totalBreakTime,
      status: event.status,
      breaks: event.breaks
    });
  });
  
  // Create complete records from events
  Object.values(eventsByEmployee).forEach(group => {
    const startEvent = group.events.find(e => e.type === 'SHIFT_START');
    const endEvent = group.events.find(e => e.type === 'SHIFT_END');
    
    if (startEvent) {
      const record = {
        employeeId: group.employeeId,
        employeeName: group.employeeName,
        employeeEmail: group.employeeEmail,
        date: group.date,
        startTime: startEvent.time,
        endTime: endEvent ? endEvent.time : null,
        workingHours: endEvent ? endEvent.workingHours : startEvent.workingHours,
        totalBreakTime: endEvent ? endEvent.totalBreakTime : startEvent.totalBreakTime,
        status: endEvent ? 'Completed' : 'Active',
        breaks: endEvent ? endEvent.breaks : startEvent.breaks,
        eventType: 'Shift',
        createdAt: startEvent.time,
        updatedAt: endEvent ? endEvent.time : startEvent.time
      };
      
      records.push(record);
    }
  });
  
  return records;
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN');
};

const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN');
};

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 'N/A';
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return `${hours}h ${minutes}m ${seconds}s`;
};

const generateSummary = (data) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysRecords = data.filter(record => record.date === today);
  const completedShifts = todaysRecords.filter(r => r.status === 'Completed');
  const activeShifts = todaysRecords.filter(r => r.status === 'Active');
  
  const totalWorkingHours = completedShifts.reduce((sum, r) => {
    return sum + (parseFloat(r.workingHours) || 0);
  }, 0);
  
  const avgWorkingHours = completedShifts.length > 0 
    ? (totalWorkingHours / completedShifts.length).toFixed(2)
    : 0;
  
  return [
    { 'Metric': 'Report Date', 'Value': formatDate(today), 'Details': 'Date of report generation' },
    { 'Metric': 'Total Records', 'Value': data.length, 'Details': 'Total attendance records in system' },
    { 'Metric': "Today's Records", 'Value': todaysRecords.length, 'Details': `Active: ${activeShifts.length}, Completed: ${completedShifts.length}` },
    { 'Metric': 'Completed Shifts Today', 'Value': completedShifts.length, 'Details': 'Shifts that have been ended' },
    { 'Metric': 'Active Shifts', 'Value': activeShifts.length, 'Details': 'Shifts currently in progress' },
    { 'Metric': 'Total Working Hours Today', 'Value': `${totalWorkingHours.toFixed(2)} hours`, 'Details': 'Sum of all completed shift hours' },
    { 'Metric': 'Average Shift Duration', 'Value': `${avgWorkingHours} hours`, 'Details': 'Average duration per completed shift' },
    { 'Metric': 'Report Generated', 'Value': formatDateTime(new Date()), 'Details': 'Date and time of export' },
  ];
};

const generateDailyAttendance = (data) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysRecords = data.filter(record => record.date === today);
  
  return todaysRecords.map(record => ({
    'Employee ID': record.employeeId,
    'Employee Name': record.employeeName,
    'Date': formatDate(record.date),
    'Login': record.startTime ? formatTime(record.startTime) : 'N/A',
    'Logout': record.endTime ? formatTime(record.endTime) : 'N/A',
    'Duration': record.endTime ? calculateDuration(record.startTime, record.endTime) : 'Active',
    'Status': record.status
  }));
};

// Export button component
export const ExcelExportButton = ({ data, fileName, className = '' }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert('No attendance data available to export');
      return;
    }
    
    // Check if we have any complete records
    const hasCompleteRecords = data.some(record => 
      record.startTime && record.endTime
    );
    
    if (!hasCompleteRecords) {
      alert('No complete shift records found. Make sure shifts have been ended.');
    }
    
    exportToExcel(data, fileName || 'attendance_report');
  };

  return (
    <button
      onClick={handleExport}
      className={`px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-lg font-medium flex items-center space-x-2 transition-all ${className}`}
    >
      <span>📊</span>
      <span>Export Attendance Report</span>
    </button>
  );
};

// Simple function to debug your data
export const debugDataFormat = (data) => {
  console.log('=== ATTENDANCE DATA DEBUG ===');
  console.log('Total records:', data.length);
  
  data.forEach((record, index) => {
    console.log(`\nRecord ${index + 1}:`);
    console.log('Employee:', record.employeeName);
    console.log('Event Type:', record.eventType);
    console.log('Start Time:', record.startTime);
    console.log('End Time:', record.endTime);
    console.log('Working Hours:', record.workingHours);
    console.log('Status:', record.status);
  });
  
  // Check for SHIFT_END events
  const shiftEnds = data.filter(r => r.eventType === 'SHIFT_END');
  console.log('\n=== SHIFT_END EVENTS ===');
  console.log('Total SHIFT_END events:', shiftEnds.length);
  shiftEnds.forEach(event => {
    console.log(`${event.employeeName}: ${event.timestamp}`);
  });
};