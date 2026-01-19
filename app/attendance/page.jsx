

import { saveAttendanceDual, getTodaysAttendanceDual } from '@/lib/dualStorage';
 export const dynamic = 'force-dynamic';
 export  async function GET(request) {
  try {
    const { searchParams } = request.nextUrl;
    const date = searchParams.get('date');
    
    const data = await getTodaysAttendanceDual();
    
    // Filter by date if specified
    let filteredData = data.combined;
    if (date) {
      filteredData = filteredData.filter(record => record.date === date);
    }
    
    return Response.json(filteredData);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return Response.json([], { status: 200 });
  }
}

export  async function POST(request) {
  try {
    const data = await request.json();
    const { employeeId, employeeName, action, shift, isLate } = data;
    
    if (!employeeId || !employeeName || !action) {
      return Response.json({ 
        error: 'Missing required fields: employeeId, employeeName, action' 
      }, { status: 400 });
    }
    
    const result = await saveAttendanceDual({
      employeeId,
      employeeName,
      action: action === 'clock-in' ? 'clock-in' : 'clock-out',
      shift: shift || '10:00 AM - 7:00 PM',
      isLate: isLate || false
    });
    
    if (result.excel || result.firebase) {
      return Response.json({ 
        message: `Attendance ${action} recorded successfully`,
        timestamp: result.timestamp,
        storage: {
          excel: result.excel ? 'saved' : 'failed',
          firebase: result.firebase ? 'saved' : 'failed'
        }
      });
    } else {
      return Response.json({ 
        error: 'Failed to save attendance to any storage' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving attendance:', error);
    return Response.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }

}


// // /app/attendance/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import AttendanceTable from '@/components/attendance/AttendanceTable'; // Your existing table
// import { 
//   TodaysExportButton, 
//   AllDataExportButton, 
//   Last7DaysExportButton 
// } from '@/components/attendance/ExportButtons';
// import { DateRangeExport } from '@/components/attendance/DateRangeExport';
// import { fetchAttendanceData } from '@/utils/excelExport';

// export default function AttendancePage() {
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filteredData, setFilteredData] = useState([]);

//   // Load attendance data from Firebase on component mount
//   useEffect(() => {
//     loadAttendanceData();
//   }, []);

//   const loadAttendanceData = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchAttendanceData();
//       setAttendanceData(data);
//       setFilteredData(data); // Initially show all data
//       console.log('Loaded', data.length, 'attendance records');
//     } catch (error) {
//       console.error('Error loading attendance:', error);
//       alert('Failed to load attendance data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter by date range
//   const filterByDateRange = (startDate, endDate) => {
//     if (!startDate || !endDate) {
//       setFilteredData(attendanceData);
//       return;
//     }

//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     end.setHours(23, 59, 59, 999);

//     const filtered = attendanceData.filter(record => {
//       const recordDate = new Date(record.timestamp);
//       return recordDate >= start && recordDate <= end;
//     });

//     setFilteredData(filtered);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading attendance data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
//           <p className="text-gray-600 mt-2">
//             View and export attendance records from the database
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500">Total Records</h3>
//             <p className="text-2xl font-bold text-gray-900 mt-2">{attendanceData.length}</p>
//             <p className="text-sm text-gray-500 mt-1">All time attendance records</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500">Current Display</h3>
//             <p className="text-2xl font-bold text-gray-900 mt-2">{filteredData.length}</p>
//             <p className="text-sm text-gray-500 mt-1">Filtered records</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//             <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
//             <p className="text-2xl font-bold text-gray-900 mt-2">
//               {attendanceData.length > 0 
//                 ? new Date(attendanceData[0].timestamp).toLocaleDateString()
//                 : 'No data'}
//             </p>
//             <p className="text-sm text-gray-500 mt-1">Most recent record</p>
//           </div>
//         </div>

//         {/* Export Section */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Export Options</h2>
          
//           {/* Quick Export Buttons */}
//           <div className="flex flex-wrap gap-3 mb-6">
//             <TodaysExportButton />
//             <Last7DaysExportButton />
//             <AllDataExportButton />
//           </div>
          
//           {/* Custom Date Range Export */}
//           <DateRangeExport />
//         </div>

//         {/* Attendance Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold text-gray-800">Attendance Records</h2>
//               <button
//                 onClick={loadAttendanceData}
//                 className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 <span>Refresh Data</span>
//               </button>
//             </div>
//             <p className="text-gray-600 mt-2">
//               Showing {filteredData.length} of {attendanceData.length} records
//             </p>
//           </div>
          
//           {/* Your existing AttendanceTable component */}
//           <AttendanceTable data={filteredData} />
//         </div>
//       </div>
//     </div>
//   );
// }