// /utils/excelExport.js
import * as XLSX from 'xlsx';
import { db } from '@/lib/firebase'; // Adjust path if needed
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from "firebase/firestore";

// ==================== FIREBASE DATA FETCHING ====================

/**
 * Fetch attendance data from Firebase Firestore
 */
export const fetchAttendanceDataFromFirebase = async (startDate = null, endDate = null) => {
  try {
    console.log('🔍 Fetching data from Firebase...');
    
    const attendanceRef = collection(db, "attendance");
    let q;
    
    if (startDate && endDate) {
      // Filter by date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      
      q = query(
        attendanceRef,
        where("timestamp", ">=", start),
        where("timestamp", "<=", end),
        orderBy("timestamp", "desc")
      );
    } else {
      // Get all data
      q = query(attendanceRef, orderBy("timestamp", "desc"));
    }
    
    const querySnapshot = await getDocs(q);
    const data = [];
    
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      
      // Convert Firebase timestamps to Date objects
      const formatDate = (timestamp) => {
        if (timestamp instanceof Timestamp) {
          return timestamp.toDate();
        } else if (timestamp?.toDate) {
          return timestamp.toDate();
        } else if (typeof timestamp === 'string') {
          return new Date(timestamp);
        }
        return timestamp || null;
      };
      
      data.push({
        id: doc.id,
        employeeId: docData.employeeId || '',
        employeeName: docData.employeeName || '',
        date: formatDate(docData.date || docData.timestamp),
        startTime: formatDate(docData.startTime || docData.timestamp),
        endTime: formatDate(docData.endTime),
        workingHours: docData.workingHours || 0,
        totalBreakTime: docData.totalBreakTime || 0,
        status: docData.status || '',
        breakHistory: docData.breakHistory || [],
        remarks: docData.remarks || '',
        createdAt: formatDate(docData.createdAt)
      });
    });
    
    console.log(`✅ Fetched ${data.length} records from Firebase`);
    return data;
    
  } catch (error) {
    console.error("❌ Error fetching from Firebase:", error);
    return [];
  }
};

/**
 * Fetch TODAY'S attendance data from Firebase
 */
export const fetchTodaysAttendanceFromFirebase = async () => {
  const today = new Date().toISOString().split('T')[0];
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  return await fetchAttendanceDataFromFirebase(startOfDay, endOfDay);
};

// ==================== MAIN EXPORT FUNCTION (UPDATED) ====================

/**
 * MAIN EXPORT FUNCTION - Now fetches from Firebase
 */
export const exportToExcel = async (
  fileName = 'attendance_report',
  useLocalData = null, // Optional: if you want to use local data instead
  startDate = null, // Optional: date range
  endDate = null    // Optional: date range
) => {
  try {
    let dataToExport;
    
    // If local data is provided, use it (for backward compatibility)
    if (useLocalData && Array.isArray(useLocalData) && useLocalData.length > 0) {
      console.log('📝 Using provided local data');
      dataToExport = useLocalData;
    } else {
      // Otherwise fetch from Firebase
      console.log('🌐 Fetching data from Firebase database...');
      dataToExport = startDate && endDate 
        ? await fetchAttendanceDataFromFirebase(startDate, endDate)
        : await fetchTodaysAttendanceFromFirebase();
    }
    
    if (!dataToExport || dataToExport.length === 0) {
      alert('No attendance data found in the database.');
      return false;
    }
    
    console.log(`📊 Exporting ${dataToExport.length} records to Excel`);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Format data for Excel
    const formattedData = dataToExport.map(record => ({
      'Employee ID': record.employeeId,
      'Employee Name': record.employeeName,
      'Date': record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
      'Shift Start': record.startTime ? new Date(record.startTime).toLocaleTimeString() : 'N/A',
      'Shift End': record.endTime ? new Date(record.endTime).toLocaleTimeString() : 'N/A',
      'Working Hours (minutes)': record.workingHours || 0,
      'Total Break Time (minutes)': record.totalBreakTime || 0,
      'Net Working Hours': calculateNetHours(record),
      'Status': record.status,
      'Breaks Taken': record.breakHistory?.length || 0,
      'Remarks': record.remarks || '',
      'Last Updated': record.createdAt ? new Date(record.createdAt).toLocaleString() : new Date().toLocaleString()
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Add column widths
    worksheet['!cols'] = [
      { wch: 12 }, // Employee ID
      { wch: 20 }, // Employee Name
      { wch: 12 }, // Date
      { wch: 12 }, // Shift Start
      { wch: 12 }, // Shift End
      { wch: 20 }, // Working Hours
      { wch: 20 }, // Total Break Time
      { wch: 18 }, // Net Working Hours
      { wch: 15 }, // Status
      { wch: 15 }, // Breaks Taken
      { wch: 25 }, // Remarks
      { wch: 20 }, // Last Updated
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

    // Add summary sheet
    const summaryData = generateSummary(dataToExport);
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Determine filename
    const today = new Date().toISOString().split('T')[0];
    const finalFileName = startDate && endDate 
      ? `${fileName}_${startDate}_to_${endDate}.xlsx`
      : `${fileName}_${today}.xlsx`;
    
    // Save file
    XLSX.writeFile(workbook, finalFileName);
    
    console.log(`✅ Excel file saved: ${finalFileName}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error exporting to Excel:', error);
    alert('Error exporting data. Please try again.');
    return false;
  }
};

// ==================== HELPER FUNCTIONS ====================

const calculateNetHours = (record) => {
  if (!record.startTime || !record.endTime) return 0;
  const start = new Date(record.startTime);
  const end = new Date(record.endTime);
  const totalMinutes = (end - start) / (1000 * 60);
  const netMinutes = totalMinutes - (record.totalBreakTime || 0);
  return (netMinutes / 60).toFixed(2);
};

const generateSummary = (data) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Filter today's records
  const todaysRecords = data.filter(record => {
    const recordDate = record.date ? new Date(record.date).toISOString().split('T')[0] : 
                      record.startTime ? new Date(record.startTime).toISOString().split('T')[0] : 
                      null;
    return recordDate === today;
  });
  
  const summary = [{
    'Report Date': new Date().toLocaleDateString(),
    'Total Records Exported': data.length,
    'Today\'s Records': todaysRecords.length,
    'Active Shifts Today': todaysRecords.filter(r => r.status === 'Active').length,
    'Completed Shifts Today': todaysRecords.filter(r => r.status === 'Completed').length,
    'Average Working Hours': calculateAverageHours(todaysRecords),
    'Total Break Time Today': todaysRecords.reduce((sum, r) => sum + (r.totalBreakTime || 0), 0),
    'Data Source': 'Firebase Firestore',
    'Generated At': new Date().toLocaleTimeString()
  }];

  return summary;
};

const calculateAverageHours = (records) => {
  const completed = records.filter(r => r.status === 'Completed' && r.workingHours);
  if (completed.length === 0) return 0;
  const total = completed.reduce((sum, r) => sum + parseFloat(r.workingHours || 0), 0);
  return (total / completed.length).toFixed(2);
};

// ==================== CONVENIENCE FUNCTIONS ====================

/**
 * Export today's data from Firebase
 */
export const exportTodaysData = async () => {
  return await exportToExcel('attendance_today');
};

/**
 * Export all data from Firebase
 */
export const exportAllData = async () => {
  return await exportToExcel('attendance_all', null, null, null);
};

/**
 * Export data for specific date range
 */
export const exportDateRange = async (startDate, endDate) => {
  return await exportToExcel('attendance_range', null, startDate, endDate);
};

// ==================== UPDATED EXPORT BUTTON COMPONENT ====================

export const ExcelExportButton = ({ 
  data = null, // Optional local data
  fileName = 'attendance_report',
  variant = 'today', // 'today', 'all', 'custom'
  startDate = null,
  endDate = null,
  className = ''
}) => {
  const [isExporting, setIsExporting] = React.useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let success = false;
      
      if (variant === 'today') {
        success = await exportTodaysData();
      } else if (variant === 'all') {
        success = await exportAllData();
      } else if (variant === 'custom' && startDate && endDate) {
        success = await exportDateRange(startDate, endDate);
      } else if (data && data.length > 0) {
        // Use local data (backward compatibility)
        success = await exportToExcel(fileName, data);
      } else {
        // Default: fetch today's data
        success = await exportTodaysData();
      }
      
      if (success) {
        console.log('Export completed successfully!');
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
      className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isExporting ? (
        <>
          <span className="animate-spin">⏳</span>
          <span>Exporting from Database...</span>
        </>
      ) : (
        <>
          <span>📊</span>
          <span>
            {variant === 'today' ? "Export Today's Data" : 
             variant === 'all' ? "Export All Data" : 
             variant === 'custom' ? "Export Custom Range" : 
             "Export to Excel"}
          </span>
        </>
      )}
    </button>
  );
};

// ==================== BACKWARD COMPATIBILITY ====================

/**
 * For backward compatibility - exports local data
 */
export const exportLocalDataToExcel = (data, fileName = 'attendance_report') => {
  return exportToExcel(fileName, data);
};

/**
 * Check Firebase connection and data
 */
export const checkFirebaseData = async () => {
  try {
    const data = await fetchTodaysAttendanceFromFirebase();
    console.log('Firebase check:', {
      connected: true,
      recordsCount: data.length,
      sampleRecord: data[0] || null
    });
    return data;
  } catch (error) {
    console.error('Firebase check failed:', error);
    return null;
  }
};