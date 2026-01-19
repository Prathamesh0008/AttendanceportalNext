import { saveAttendance, getTodaysAttendance } from '@/lib/attendanceStorage';

export async function GET() {
  try {
    const attendance = getTodaysAttendance();
    return Response.json(attendance);
  } catch (error) {
    console.error('Error:', error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { employeeId, employeeName, action, shift, isLate } = data;
    
    const result = await saveAttendance({
      employeeId,
      employeeName,
      action,
      shift: shift || '10:00 AM - 7:00 PM',
      isLate: isLate || false
    });
    
    return Response.json({
      message: `Attendance ${action} recorded`,
      success: result.success,
      timestamp: result.timestamp,
      storage: {
        excel: result.excel,
        firebase: result.firebase
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}