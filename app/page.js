'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Coffee,
  Sandwich,
  Moon,
  Wind,
  CalendarDays,
  Download,
  Play,
  StopCircle,
  Bell,
  Mail,
  AlertCircle,
  X,
  Send,
  CheckCircle,
  Clock,
  Users,
  LogOut,
  User,
  FileText,
  Activity,
  Shield,
  UserCircle,
  AtSign,
  Smartphone
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Email function
const sendRealEmail = async (to, subject, htmlContent, emailType = null, emailData = null) => {
  try {
    console.log('Sending email to:', to, 'Subject:', subject, 'Type:', emailType);
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        htmlContent,
        emailType,
        emailData,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    const result = await response.json();
    console.log('Email API response:', result);
    
    if (result.simulated) {
      console.log('⚠️ Email simulated');
      return { 
        success: true, 
        simulated: true,
        message: result.message
      };
    }
    
    return result;
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Sound notification
const playNotificationSound = () => {
  try {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (error) {
    console.log('Sound notification failed');
  }
};

// Modal Component - Dark Theme
const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-70" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            {title && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// TimerBar Component - Dark Theme
const TimerBar = ({ totalSeconds, breakType, onComplete, onExceed }) => {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isExceeded, setIsExceeded] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        const newTime = prev - 1;
        
        if (newTime <= -1 && !isExceeded) {
          setIsExceeded(true);
          onExceed?.(Math.abs(newTime));
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onComplete, onExceed, isExceeded]);

  const progress = Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100);
  const minutes = Math.floor(Math.abs(secondsLeft) / 60);
  const seconds = Math.abs(secondsLeft) % 60;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-300">{breakType} Break</span>
        <div className={`text-sm font-mono font-bold ${isExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
          {isExceeded ? '⏰ EXCEEDED' : '⏱️ Remaining'}: {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isExceeded 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : progress > 80 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
};

// Employee data WITH EMAILS
const employees = [
  { 
    id: "NTS-001", 
    name: "Prathamesh Shinde", 
    shift: "10:00 AM - 7:00 PM",
    email: "prathameshs157@gmail.com",
    phone: "+91 9876543210"
  },
  { 
    id: "NTS-002", 
    name: "Adarsh Singh", 
    shift: "10:00 AM - 7:00 PM",
    email: "mawesome230@gmail.com",
    phone: "+91 9876543211"
  },
  { 
    id: "NTS-003", 
    name: "Payal Nalavade", 
    shift: "9:00 AM - 6:00 PM",
    email: "Payalnalwade73@gmail.com",
    phone: "+91 9876543212"
  },
  { 
    id: "NTS-004", 
    name: "Vaishnavi GHODVINDE", 
    shift: "9:00 AM - 6:00 PM",
    email: "vaishnavighodvinde@gmail.com",
    phone: "+91 9876543213"
  },
  { 
    id: "NTS-005", 
    name: "RUSHIKESH ANDHALE", 
    shift: "9:00 AM - 6:00 PM",
    email: "rushikeshandhale1010@gmail.com",
    phone: "+91 9876543214"
  },
  { 
    id: "NTS-006", 
    name: "Upasana Patil", 
    shift: "9:00 AM - 6:00 PM",
    email: "patilupasana27@gmail.com",
    phone: "+91 9876543215"
  },
  { 
    id: "NTS-007", 
    name: "Prajakta Dhande", 
    shift: "9:00 AM - 6:00 PM",
    email: "dhandeprajakta123@gmail.com",
    phone: "+91 9876543216"
  },
  { 
    id: "NTS-008", 
    name: "Chotelal Singh", 
    shift: "9:00 AM - 6:00 PM",
    email: "chotelal.singh@novatechsciences.com",
    phone: "+91 9876543217"
  },
];

// Manager configuration
const MANAGER = {
  name: "Prathamesh Shinde",
  email: "sprathamesh581@gmail.com",
  phone: "+91 9876543210"
};

const BREAK_LIMITS = {
  Tea: 15,
  Lunch: 30,
  Evening: 15,
  Breather: 5
};

const ADMIN_PASSWORD = "Sky@2204";

export default function HomePage() {
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empPhone, setEmpPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [shiftStarted, setShiftStarted] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState(null);
  const [activeBreak, setActiveBreak] = useState(null);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveData, setLeaveData] = useState({ from: '', to: '', reason: '' });
  const [alerts, setAlerts] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveDataLocal, setLeaveDataLocal] = useState([]);
  const [breakHistory, setBreakHistory] = useState([]);
  const [showBreakOverModal, setShowBreakOverModal] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    shiftStart: true,
    shiftEnd: true,
    breakExceeded: true,
    leaveApplied: true,
    dailySummary: true
  });

  const currentEmployee = useMemo(
    () => employees.find((e) => e.id === empId) || null,
    [empId]
  );

  // Handle break time exceeded - SEND TO BOTH MANAGER AND EMPLOYEE
  const handleBreakExceeded = async (breakType, exceededSeconds) => {
    const exceededMinutes = Math.ceil(exceededSeconds / 60);
    const allowedMinutes = BREAK_LIMITS[breakType];
    const actualMinutes = allowedMinutes + exceededMinutes;
    
    playNotificationSound();
    
    const newAlert = {
      id: Date.now(),
      type: 'warning',
      message: `${breakType} break exceeded by ${exceededMinutes} minute(s)!`,
      timestamp: new Date(),
      breakType,
      exceededBy: exceededMinutes,
      employee: empName,
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    setShowBreakOverModal(true);
    
    setBreakHistory(prev => [...prev, {
      ...newAlert,
      employeeId: empId,
      allowedTime: allowedMinutes,
    }]);
    
    // Email notifications based on settings
    setEmailStatus('Sending notifications...');
    
    try {
      // Send to MANAGER
      if (notificationSettings.breakExceeded) {
        const managerEmailResult = await sendRealEmail(
          MANAGER.email, 
          `⏰ BREAK ALERT: ${empName} exceeded ${breakType} break`,
          '',
          'breakExceeded',
          {
            employeeName: empName,
            employeeId: empId,
            breakType: breakType,
            exceededBy: exceededMinutes,
            allowedMinutes: allowedMinutes,
            actualMinutes: actualMinutes,
            time: new Date().toLocaleString(),
          }
        );
      }
      
      // Send to EMPLOYEE
      if (notificationSettings.breakExceeded && empEmail) {
        const employeeEmailResult = await sendRealEmail(
          empEmail,
          `⚠️ Break Time Exceeded - ${empName}`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #dc2626; text-align: center;">Break Time Exceeded Notification</h2>
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Employee:</strong> ${empName} (${empId})</p>
                <p><strong>Break Type:</strong> ${breakType}</p>
                <p><strong>Exceeded By:</strong> ${exceededMinutes} minutes</p>
                <p><strong>Allowed Time:</strong> ${allowedMinutes} minutes</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p style="color: #666; font-size: 14px;">Please be mindful of break timings in the future.</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
              <p style="text-align: center; color: #999; font-size: 12px;">
                Nova TechSciences Attendance Portal<br>
                This is an automated notification
              </p>
            </div>
          `,
          null,
          {
            employeeName: empName,
            employeeId: empId,
            breakType: breakType,
            exceededBy: exceededMinutes,
            allowedMinutes: allowedMinutes,
            actualMinutes: actualMinutes,
          }
        );
      }
      
      setEmailStatus('✅ Notifications sent successfully!');
      
    } catch (error) {
      console.error('Error sending emails:', error);
      setEmailStatus('❌ Failed to send some notifications');
    }
  };

  const handleBreakComplete = (breakType, actualMinutes) => {
    const newAlert = {
      id: Date.now(),
      type: 'success',
      message: `${breakType} break completed in ${actualMinutes} minute(s)`,
      timestamp: new Date(),
      breakType,
      employee: empName,
    };
    
    setAlerts(prev => [newAlert, ...prev]);
  };

  // Start Shift - NOTIFY EMPLOYEE AND MANAGER
 // In startShift function
const startShift = async () => {
  if (!empId) {
    alert('Please select an employee first');
    return;
  }

  const now = new Date();
  console.log('Starting shift at:', now.toISOString());
  
  setShiftStarted(true);
  setShiftStartTime(now);
  
  const newRecord = {
    empId,
    empName,
    action: 'SHIFT_START',
    timestamp: now.toISOString(),
    date: now.toLocaleDateString('en-IN'),
    time: now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    }),
    shiftType: 'Regular',
  };
  
  setAttendanceData(prev => [...prev, newRecord]);
  console.log('SHIFT_START record added:', newRecord);
  
  // ... rest of your startShift function
};

// In endShift function
const endShift = async () => {
  if (!shiftStarted) {
    alert('Shift has not been started');
    return;
  }

  const now = new Date();
  console.log('Ending shift at:', now.toISOString());
  console.log('Shift started at:', shiftStartTime?.toISOString());
  
  if (shiftStartTime && now < shiftStartTime) {
    alert('Error: End time cannot be before start time');
    return;
  }

  // Calculate working hours properly
  let workingHours = '0h 0m';
  if (shiftStartTime) {
    const diffMs = now - shiftStartTime;
    const totalMinutes = diffMs / (1000 * 60);
    const netMinutes = totalMinutes - totalBreakTime;
    
    if (netMinutes >= 0) {
      const hours = Math.floor(netMinutes / 60);
      const minutes = Math.round(netMinutes % 60);
      workingHours = `${hours}h ${minutes}m`;
    } else {
      workingHours = 'Invalid (Breaks > Duration)';
    }
  }

  const newRecord = {
    empId,
    empName,
    action: 'SHIFT_END',
    timestamp: now.toISOString(),
    date: new Date(shiftStartTime).toLocaleDateString('en-IN'),
    time: now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    }),
    workingHours,
    totalBreaks: totalBreakTime,
    shiftStartTimestamp: shiftStartTime?.toISOString(),
    shiftEndTimestamp: now.toISOString(),
    durationMinutes: Math.round((now - shiftStartTime) / (1000 * 60)),
  };
  
  setAttendanceData(prev => [...prev, newRecord]);
  console.log('SHIFT_END record added:', newRecord);

  // Reset shift state
  setShiftStarted(false);
  setShiftStartTime(null);
  setTotalBreakTime(0);
  setActiveBreak(null);

  // Send email notifications
  setEmailStatus('Sending shift summary...');
  
  try {
    // Send detailed summary to EMPLOYEE
    if (notificationSettings.shiftEnd && empEmail) {
      await sendRealEmail(
        empEmail,
        `📊 Shift Summary - ${empName}`,
        '',
        'shiftSummary',
        {
          employeeName: empName,
          employeeId: empId,
          shiftStart: shiftStartTime?.toLocaleTimeString() || 'N/A',
          shiftEnd: now.toLocaleTimeString(),
          shiftDate: now.toLocaleDateString(),
          totalBreaks: totalBreakTime,
          workingHours: workingHours,
          breakHistory: breakHistory.filter(b => b.employee === empName && 
            new Date(b.timestamp).toDateString() === now.toDateString()),
        }
      );
    }
    
    // Optional: Send to manager too
    if (notificationSettings.shiftEnd) {
      await sendRealEmail(
        MANAGER.email,
        `📋 Shift Completed - ${empName}`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h3 style="color: #2563eb;">Shift Completion Report</h3>
            <p><strong>Employee:</strong> ${empName} (${empId})</p>
            <p><strong>Shift:</strong> ${shiftStartTime?.toLocaleTimeString()} - ${now.toLocaleTimeString()}</p>
            <p><strong>Working Hours:</strong> ${workingHours}</p>
            <p><strong>Total Breaks:</strong> ${totalBreakTime} minutes</p>
            <p><strong>Date:</strong> ${now.toLocaleDateString()}</p>
          </div>
        `
      );
    }
    
    setEmailStatus('✅ Shift summary sent to employee!');
    alert(`✅ Shift ended successfully!\nWorking Hours: ${workingHours}\nTotal Breaks: ${totalBreakTime} minutes`);

  } catch (error) {
    console.error('Error sending shift end emails:', error);
    setEmailStatus('❌ Failed to send summary');
    alert('Shift ended, but email notification failed.');
  }
};

  const startBreak = (type, minutes) => {
    if (!shiftStarted) {
      alert('Please start your shift first');
      return;
    }

    if (activeBreak) {
      alert('Please end your current break first');
      return;
    }

    setActiveBreak({
      type,
      minutes,
      startTime: Date.now(),
      timerKey: Date.now(),
    });

    const newAlert = {
      id: Date.now(),
      type: 'info',
      message: `${type} break started (${minutes} minutes)`,
      timestamp: new Date(),
      breakType: type,
      employee: empName,
    };
    
    setAlerts(prev => [newAlert, ...prev]);
  };

  const endBreak = () => {
    if (!activeBreak) return;

    const elapsedMinutes = Math.ceil((Date.now() - activeBreak.startTime) / 60000);
    setTotalBreakTime(prev => prev + elapsedMinutes);
    
    if (elapsedMinutes <= activeBreak.minutes) {
      handleBreakComplete(activeBreak.type, elapsedMinutes);
    } else {
      handleBreakExceeded(activeBreak.type, (elapsedMinutes - activeBreak.minutes) * 60);
    }
    
    setActiveBreak(null);
  };

  // Handle Leave - SEND TO MANAGER AND CC EMPLOYEE
  const handleLeaveSubmit = async () => {
    if (!empId || !leaveData.from || !leaveData.to || !leaveData.reason) {
      alert('Please fill all leave details');
      return;
    }

    const newLeave = {
      empId,
      empName,
      fromDate: leaveData.from,
      toDate: leaveData.to,
      reason: leaveData.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString(),
    };
    
    setLeaveDataLocal(prev => [...prev, newLeave]);

    setEmailStatus('Processing leave application...');
    
    try {
      // Send to MANAGER (primary recipient)
      if (notificationSettings.leaveApplied) {
        await sendRealEmail(
          MANAGER.email,
          `📅 Leave Application - ${empName}`,
          '',
          'leaveApplication',
          {
            employeeName: empName,
            employeeId: empId,
            fromDate: leaveData.from,
            toDate: leaveData.to,
            reason: leaveData.reason,
            appliedDate: new Date().toLocaleDateString(),
            days: Math.ceil((new Date(leaveData.to) - new Date(leaveData.from)) / (1000 * 60 * 60 * 24)) + 1,
          }
        );
      }
      
      // Send confirmation to EMPLOYEE
      if (notificationSettings.leaveApplied && empEmail) {
        await sendRealEmail(
          empEmail,
          `✅ Leave Application Submitted - ${empName}`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #2563eb; text-align: center;">Leave Application Submitted</h2>
              <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Employee:</strong> ${empName} (${empId})</p>
                <p><strong>Leave Period:</strong> ${leaveData.from} to ${leaveData.to}</p>
                <p><strong>Reason:</strong> ${leaveData.reason}</p>
                <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">Pending Approval</span></p>
                <p><strong>Applied On:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p style="color: #666; font-size: 14px;">
                Your leave application has been submitted successfully. 
                Manager <strong>${MANAGER.name}</strong> has been notified for approval.
              </p>
              <p style="color: #666; font-size: 14px;">
                You will receive another email once your leave is approved/rejected.
              </p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
              <p style="text-align: center; color: #999; font-size: 12px;">
                Nova TechSciences HR Portal<br>
                This is an automated confirmation
              </p>
            </div>
          `
        );
      }
      
      setEmailStatus('✅ Leave application submitted! Both manager and employee notified.');
      alert('Leave application submitted successfully! Check your email for confirmation.');

    } catch (error) {
      console.error('Error sending leave emails:', error);
      setEmailStatus('❌ Failed to send email notifications');
      alert('Leave submitted but email notification failed.');
    }

    setLeaveOpen(false);
    setLeaveData({ from: '', to: '', reason: '' });
  };

  // Send Daily Summary to All Employees
  const sendDailySummaryToAll = async () => {
    const password = prompt('Enter admin password to send daily summary:');
    if (password !== ADMIN_PASSWORD) {
      alert('Incorrect password');
      return;
    }

    setEmailStatus('Sending daily summaries to all employees...');

    try {
      const today = new Date().toLocaleDateString('en-IN');
      let successCount = 0;
      let failCount = 0;

      for (const employee of employees) {
        if (employee.email) {
          try {
            await sendRealEmail(
              employee.email,
              `📈 Daily Attendance Summary - ${today}`,
              `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #7c3aed; text-align: center;">Daily Attendance Summary</h2>
                  <div style="background-color: #f5f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #5b21b6;">Hello ${employee.name},</h3>
                    <p>Here's your daily attendance summary for <strong>${today}</strong>:</p>
                    
                    <div style="margin: 15px 0; padding: 15px; background: white; border-radius: 8px;">
                      <p><strong>Employee ID:</strong> ${employee.id}</p>
                      <p><strong>Name:</strong> ${employee.name}</p>
                      <p><strong>Shift Timing:</strong> ${employee.shift}</p>
                      <p><strong>Date:</strong> ${today}</p>
                    </div>
                    
                    <p style="color: #666; margin-top: 20px;">
                      This is an automated daily summary from Nova TechSciences Attendance Portal.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="color: #999; font-size: 12px;">
                      Nova TechSciences<br>
                      Precision | Purity | Progress
                    </p>
                  </div>
                </div>
              `
            );
            successCount++;
          } catch (error) {
            console.error(`Failed to send to ${employee.email}:`, error);
            failCount++;
          }
        }
      }

      setEmailStatus(`✅ Daily summaries sent! Success: ${successCount}, Failed: ${failCount}`);
      alert(`Daily summaries sent to ${successCount} employees. ${failCount} failed.`);

    } catch (error) {
      console.error('Error sending daily summaries:', error);
      setEmailStatus('❌ Failed to send daily summaries');
    }
  };

  // Send Custom Email to Employee
  const sendCustomEmailToEmployee = async () => {
    if (!empEmail) {
      alert('Please select an employee first');
      return;
    }

    const subject = prompt('Enter email subject:');
    if (!subject) return;

    const message = prompt('Enter email message:');
    if (!message) return;

    setEmailStatus(`Sending email to ${empName}...`);

    try {
      await sendRealEmail(
        empEmail,
        subject,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">${subject}</h2>
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>Dear ${empName},</p>
              <p>${message}</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              This is an automated message from Nova TechSciences Attendance Portal.
            </p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="text-align: center; color: #999; font-size: 12px;">
              Nova TechSciences HR Department<br>
              ${new Date().toLocaleDateString()}
            </p>
          </div>
        `
      );

      setEmailStatus(`✅ Email sent to ${empName}!`);
      alert('Email sent successfully!');

    } catch (error) {
      console.error('Error sending custom email:', error);
      setEmailStatus('❌ Failed to send email');
    }
  };

  const downloadExcel = async () => {
  const password = prompt('Enter admin password:');
  if (password !== ADMIN_PASSWORD) {
    alert('Incorrect password');
    return;
  }

  try {
    const wb = XLSX.utils.book_new();

    // Process attendance data to combine SHIFT_START and SHIFT_END
    // Process attendance data to combine SHIFT_START and SHIFT_END
const processedAttendance = [];
const shiftMap = new Map();

// First pass: Organize by employee and date
attendanceData.forEach(record => {
  const date = record.date || new Date(record.timestamp).toLocaleDateString('en-IN');
  const key = `${record.empId}_${date}`;
  
  if (!shiftMap.has(key)) {
    shiftMap.set(key, {
      employeeId: record.empId,
      employeeName: record.empName,
      date: date,
      startTime: null,
      endTime: null,
      startDateTime: null,
      endDateTime: null,
      workingHours: null,
      totalBreaks: 0, // Initialize to 0
      status: 'Incomplete',
      breakTime: 0
    });
  }
  
  const shift = shiftMap.get(key);
  
  if (record.action === 'SHIFT_START') {
    const startDateTime = new Date(record.timestamp);
    if (!isNaN(startDateTime.getTime())) {
      shift.startTime = startDateTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      });
      shift.startDateTime = startDateTime.toLocaleString('en-IN');
      shift.startTimestamp = record.timestamp;
      shift.status = 'Active';
    }
  }
  
  if (record.action === 'SHIFT_END') {
    const endDateTime = new Date(record.timestamp);
    if (!isNaN(endDateTime.getTime())) {
      shift.endTime = endDateTime.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      });
      shift.endDateTime = endDateTime.toLocaleString('en-IN');
      shift.endTimestamp = record.timestamp;
      shift.workingHours = record.workingHours || 'N/A';
      shift.totalBreaks = record.totalBreaks || 0;
      shift.status = 'Completed';
    }
  }
});

// Second pass: Calculate working hours for completed shifts
shiftMap.forEach(shift => {
  if (shift.startTimestamp && shift.endTimestamp) {
    try {
      const start = new Date(shift.startTimestamp);
      const end = new Date(shift.endTimestamp);
      
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
        const diffMs = end - start;
        const totalMinutes = diffMs / (1000 * 60);
        const netMinutes = totalMinutes - (shift.totalBreaks || 0);
        
        if (netMinutes >= 0) {
          const hours = Math.floor(netMinutes / 60);
          const minutes = Math.round(netMinutes % 60);
          shift.workingHours = `${hours}h ${minutes}m`;
          shift.netWorkingHours = `${hours}h ${minutes}m`;
        } else {
          shift.workingHours = 'Invalid: Breaks > Duration';
          shift.netWorkingHours = 'Invalid';
        }
      } else {
        shift.workingHours = 'Invalid Time';
        shift.netWorkingHours = 'Invalid';
      }
    } catch (error) {
      shift.workingHours = 'Error';
      shift.netWorkingHours = 'Error';
    }
  }
});

// Convert map to array
shiftMap.forEach(shift => {
  processedAttendance.push(shift);
});

// Sort by date and time
processedAttendance.sort((a, b) => {
  const dateA = new Date(a.startDateTime || a.date);
  const dateB = new Date(b.startDateTime || b.date);
  return dateB - dateA; // Most recent first
});

    // ==================== SHEET 1: SHIFT DETAILS ====================
    if (processedAttendance.length > 0) {
     const attendanceSheetData = processedAttendance.map(shift => {
  // Calculate duration properly
  let workingHours = 'N/A';
  let netWorkingHours = 'N/A';
  
  if (shift.startTimestamp && shift.endTimestamp) {
    try {
      const start = new Date(shift.startTimestamp);
      const end = new Date(shift.endTimestamp);
      
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
        const diffMs = end - start;
        const totalMinutes = diffMs / (1000 * 60);
        const netMinutes = totalMinutes - (shift.totalBreaks || 0);
        
        if (netMinutes >= 0) {
          const hours = Math.floor(netMinutes / 60);
          const minutes = Math.round(netMinutes % 60);
          workingHours = `${hours}h ${minutes}m`;
          netWorkingHours = `${hours}h ${minutes}m`;
        } else {
          workingHours = 'Invalid (Breaks > Duration)';
          netWorkingHours = 'Invalid';
        }
      }
    } catch (error) {
      workingHours = 'Error';
      netWorkingHours = 'Error';
    }
  }
  
  return {
    'Date': shift.date,
    'Employee ID': shift.employeeId,
    'Employee Name': shift.employeeName,
    'Login Time': shift.startTime || 'N/A',
    'Login Date & Time': shift.startDateTime || 'N/A',
    'Logout Time': shift.endTime || 'N/A',
    'Logout Date & Time': shift.endDateTime || 'N/A',
    'Shift Status': shift.status,
    'Working Hours': workingHours,
    'Total Breaks (min)': shift.totalBreaks || 0,
    'Net Working Hours': netWorkingHours,
    'Shift Duration (min)': shift.startTimestamp && shift.endTimestamp ? 
      Math.round((new Date(shift.endTimestamp) - new Date(shift.startTimestamp)) / (1000 * 60)) : 'N/A',
    'Remarks': '',
    'Record Type': shift.startTime && shift.endTime ? 'Complete Shift' : 'Partial'
  };
});

      const ws1 = XLSX.utils.json_to_sheet(attendanceSheetData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Shift Details');
      
      // Set column widths
      ws1['!cols'] = [
        { wch: 12 }, // Date
        { wch: 12 }, // Employee ID
        { wch: 20 }, // Employee Name
        { wch: 12 }, // Login Time
        { wch: 20 }, // Login Date & Time
        { wch: 12 }, // Logout Time
        { wch: 20 }, // Logout Date & Time
        { wch: 15 }, // Shift Status
        { wch: 15 }, // Working Hours
        { wch: 15 }, // Total Breaks
        { wch: 15 }, // Net Working Hours
        { wch: 25 }, // Remarks
        { wch: 15 }, // Record Type
      ];
    }

    // ==================== SHEET 2: RAW ATTENDANCE LOGS ====================
    if (attendanceData.length > 0) {
      const rawLogsData = attendanceData.map(record => ({
        'Date': record.date || new Date(record.timestamp).toLocaleDateString('en-IN'),
        'Time': record.time || new Date(record.timestamp).toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit',
          hour12: true 
        }),
        'Employee ID': record.empId,
        'Employee Name': record.empName,
        'Employee Email': employees.find(e => e.id === record.empId)?.email || 'N/A',
        'Action': record.action,
        'Working Hours': record.workingHours || '',
        'Total Breaks': record.totalBreaks || 0,
        'Recorded At': new Date(record.timestamp).toLocaleString('en-IN'),
      }));
      
      const ws2 = XLSX.utils.json_to_sheet(rawLogsData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Raw Logs');
    }

    // ==================== SHEET 3: LEAVE REQUESTS ====================
    if (leaveDataLocal.length > 0) {
      const leaveSheetData = leaveDataLocal.map(record => ({
        'Employee ID': record.empId,
        'Employee Name': record.empName,
        'Employee Email': employees.find(e => e.id === record.empId)?.email || 'N/A',
        'From Date': record.fromDate,
        'To Date': record.toDate,
        'Reason': record.reason,
        'Status': record.status,
        'Applied On': new Date(record.appliedOn).toLocaleString('en-IN'),
        'Total Days': calculateLeaveDays(record.fromDate, record.toDate),
      }));
      const ws3 = XLSX.utils.json_to_sheet(leaveSheetData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Leave Requests');
      
      ws3['!cols'] = [
        { wch: 12 }, // Employee ID
        { wch: 20 }, // Employee Name
        { wch: 25 }, // Employee Email
        { wch: 12 }, // From Date
        { wch: 12 }, // To Date
        { wch: 30 }, // Reason
        { wch: 12 }, // Status
        { wch: 20 }, // Applied On
        { wch: 10 }, // Total Days
      ];
    }

    // ==================== SHEET 4: EMPLOYEE DIRECTORY ====================
    const employeeSheetData = employees.map(emp => ({
      'Employee ID': emp.id,
      'Employee Name': emp.name,
      'Email': emp.email,
      'Phone': emp.phone,
      'Shift Timing': emp.shift,
      'Status': 'Active',
    }));
    const ws4 = XLSX.utils.json_to_sheet(employeeSheetData);
    XLSX.utils.book_append_sheet(wb, ws4, 'Employee Directory');

    // ==================== SHEET 5: SUMMARY REPORT ====================
    const today = new Date().toLocaleDateString('en-IN');
    const todaysShifts = processedAttendance.filter(shift => shift.date === today);
    const completedToday = todaysShifts.filter(shift => shift.status === 'Completed').length;
    const activeToday = todaysShifts.filter(shift => shift.status === 'Active').length;
    const incompleteToday = todaysShifts.filter(shift => shift.status === 'Incomplete').length;
    
    const summaryData = [
      ['Report Generated:', new Date().toLocaleString('en-IN')],
      ['Report Date:', today],
      ['Total Employees:', employees.length],
      ["Today's Attendance:", todaysShifts.length],
      ['Completed Shifts Today:', completedToday],
      ['Active Shifts Now:', activeToday],
      ['Incomplete Records:', incompleteToday],
      ['Total Leave Requests:', leaveDataLocal.length],
      ['Pending Leaves:', leaveDataLocal.filter(l => l.status === 'Pending').length],
      ['Average Shift Duration:', calculateAverageShiftDuration(todaysShifts)],
      ['System Version:', 'Nova TechSciences Portal v2.0'],
    ];
    
    const ws5 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws5, 'Summary');
    
    ws5['!cols'] = [
      { wch: 25 }, // Metric
      { wch: 30 }, // Value
    ];

    // ==================== SHEET 6: BREAK HISTORY ====================
    if (breakHistory.length > 0) {
      const breakSheetData = breakHistory.map(breakRec => {
        const breakDate = breakRec.timestamp ? new Date(breakRec.timestamp) : new Date();
        return {
          'Date': breakDate.toLocaleDateString('en-IN'),
          'Time': breakDate.toLocaleTimeString('en-IN'),
          'Employee ID': breakRec.employeeId || 'N/A',
          'Employee Name': breakRec.employee || 'N/A',
          'Break Type': breakRec.breakType || 'N/A',
          'Allowed Time': breakRec.allowedTime || BREAK_LIMITS[breakRec.breakType] || 0,
          'Exceeded By': breakRec.exceededBy || 0,
          'Status': breakRec.exceededBy > 0 ? 'Exceeded' : 'Completed',
          'Alert Type': breakRec.type || 'N/A',
          'Message': breakRec.message || 'N/A',
        };
      });
      
      const ws6 = XLSX.utils.json_to_sheet(breakSheetData);
      XLSX.utils.book_append_sheet(wb, ws6, 'Break History');
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `NTS_Attendance_Report_${timestamp}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
    alert(`✅ Report downloaded successfully!\nFilename: ${fileName}`);
    
  } catch (error) {
    console.error('Error downloading Excel:', error);
    alert('❌ Failed to download report: ' + error.message);
  }
};

// Helper functions
const calculateWorkingHoursForShift = (startTime, endTime, totalBreaks = 0) => {
  if (!startTime || !endTime) return 'N/A';
  
  try {
    // Parse the dates properly
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Invalid Time';
    }
    
    // Make sure end time is after start time
    if (end <= start) {
      return 'Invalid: End before Start';
    }
    
    const diffMs = end - start;
    const totalMinutes = diffMs / (1000 * 60);
    
    // Subtract break time
    const netMinutes = totalMinutes - (totalBreaks || 0);
    
    if (netMinutes < 0) return 'Invalid: Breaks > Duration';
    
    const hours = Math.floor(netMinutes / 60);
    const minutes = Math.round(netMinutes % 60);
    
    return `${hours}h ${minutes}m`;
  } catch (error) {
    console.error('Error calculating working hours:', error);
    return 'Calculation Error';
  }
};

const calculateNetHours = (shift) => {
  if (!shift.endTime || !shift.workingHours) return 'N/A';
  return shift.workingHours; // You can adjust this if you have break time to subtract
};

const calculateLeaveDays = (fromDate, toDate) => {
  if (!fromDate || !toDate) return 0;
  try {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  } catch (error) {
    return 0;
  }
};

const calculateAverageShiftDuration = (shifts) => {
  const completedShifts = shifts.filter(shift => shift.status === 'Completed' && shift.workingHours);
  if (completedShifts.length === 0) return 'N/A';
  
  try {
    let totalMinutes = 0;
    completedShifts.forEach(shift => {
      const match = shift.workingHours.match(/(\d+)h\s*(\d+)m/);
      if (match) {
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        totalMinutes += (hours * 60) + minutes;
      }
    });
    
    const avgMinutes = totalMinutes / completedShifts.length;
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = Math.round(avgMinutes % 60);
    return `${avgHours}h ${avgMins}m`;
  } catch (error) {
    return 'N/A';
  }
};

  const calculateWorkingHours = (start, end, breakMinutes) => {
    if (!start || !end) return '0h 0m';
    const diffMs = end - start;
    const diffHours = (diffMs / (1000 * 60 * 60)) - (breakMinutes / 60);
    const hours = Math.floor(diffHours);
    const minutes = Math.round((diffHours - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                  Nova TechSciences
                </h1>
                <p className="text-xs text-gray-400">Attendance & Break Management Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                <CalendarDays className="w-4 h-4" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white"
                />
              </div>
              
              <button
                onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Notifications</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Settings Panel */}
      {showNotificationSettings && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Email Notification Settings</h3>
              <button
                onClick={() => setShowNotificationSettings(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotificationSettings(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Email Status Banner */}
        {emailStatus && (
          <div className="bg-gradient-to-r from-blue-900/30 to-teal-900/30 border border-blue-800/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="font-medium text-blue-300">{emailStatus}</p>
                  <p className="text-xs text-blue-400/70">
                    Employee: <span className="text-blue-300">{empEmail || 'Not selected'}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setEmailStatus(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Employee & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employee Card */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-400" />
                    Employee Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Select Your Name
                      </label>
                      <select
                        value={empId}
                        onChange={(e) => {
                          const id = e.target.value;
                          const emp = employees.find(e => e.id === id);
                          if (emp) {
                            setEmpId(id);
                            setEmpName(emp.name);
                            setEmpEmail(emp.email);
                            setEmpPhone(emp.phone);
                          }
                        }}
                        disabled={shiftStarted}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white disabled:bg-gray-900 disabled:border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      >
                        <option value="" className="bg-gray-800">-- Select Employee --</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id} className="bg-gray-800">
                            {emp.id} - {emp.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Shift Timing
                      </label>
                      <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-amber-400" />
                          <span className="text-white">{currentEmployee?.shift || 'Not selected'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {currentEmployee && (
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="font-bold text-white">{currentEmployee.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{currentEmployee.name}</p>
                          <p className="text-sm text-gray-400">{currentEmployee.id}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <AtSign className="w-4 h-4 text-blue-400" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm text-white">{currentEmployee.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-green-400" />
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm text-white">{currentEmployee.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  {!shiftStarted ? (
                    <button
                      onClick={startShift}
                      disabled={!empId}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                    >
                      <Play className="w-5 h-5" />
                      <span>Start Shift</span>
                    </button>
                  ) : (
                    <button
                      onClick={endShift}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
                    >
                      <StopCircle className="w-5 h-5" />
                      <span>End Shift</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Break Management */}
            {shiftStarted && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-amber-400" />
                  Take a Break
                </h3>
                
                {/* Active Break Timer */}
                {activeBreak ? (
                  <div className="mb-6 p-5 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="font-bold text-white text-xl">
                          ⏱️ Active: {activeBreak.type} Break
                        </h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Allowed: <span className="text-emerald-400 font-semibold">{activeBreak.minutes} minutes</span>
                        </p>
                      </div>
                      <button
                        onClick={endBreak}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
                      >
                        End Break Now
                      </button>
                    </div>
                    
                    <TimerBar
                      totalSeconds={activeBreak.minutes * 60}
                      breakType={activeBreak.type}
                      onComplete={() => {
                        playNotificationSound();
                        setShowBreakOverModal(true);
                      }}
                      onExceed={(exceededSeconds) => {
                        handleBreakExceeded(activeBreak.type, exceededSeconds);
                      }}
                    />
                    
                    <div className="mt-6 p-4 bg-blue-900/30 border border-blue-800/30 rounded-lg">
                      <p className="text-sm text-blue-300 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Both you and manager will receive email alerts if break is exceeded
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Break Buttons */
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <button
                      onClick={() => startBreak('Tea', 15)}
                      className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 hover:from-amber-800/40 hover:to-amber-700/30 border border-amber-800/30 p-5 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 hover:border-amber-700/50 group"
                    >
                      <Coffee className="w-10 h-10 text-amber-400 group-hover:text-amber-300" />
                      <span className="font-semibold text-amber-300">Tea Break</span>
                      <span className="text-sm bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full border border-amber-800/50">15 min</span>
                    </button>

                    <button
                      onClick={() => startBreak('Lunch', 30)}
                      className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 hover:from-emerald-800/40 hover:to-emerald-700/30 border border-emerald-800/30 p-5 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 hover:border-emerald-700/50 group"
                    >
                      <Sandwich className="w-10 h-10 text-emerald-400 group-hover:text-emerald-300" />
                      <span className="font-semibold text-emerald-300">Lunch</span>
                      <span className="text-sm bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800/50">30 min</span>
                    </button>

                    <button
                      onClick={() => startBreak('Evening', 15)}
                      className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 hover:from-orange-800/40 hover:to-orange-700/30 border border-orange-800/30 p-5 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 hover:border-orange-700/50 group"
                    >
                      <Moon className="w-10 h-10 text-orange-400 group-hover:text-orange-300" />
                      <span className="font-semibold text-orange-300">Evening</span>
                      <span className="text-sm bg-orange-900/50 text-orange-300 px-3 py-1 rounded-full border border-orange-800/50">15 min</span>
                    </button>

                    <button
                      onClick={() => startBreak('Breather', 5)}
                      className="bg-gradient-to-br from-sky-900/30 to-sky-800/20 hover:from-sky-800/40 hover:to-sky-700/30 border border-sky-800/30 p-5 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all hover:scale-105 hover:border-sky-700/50 group"
                    >
                      <Wind className="w-10 h-10 text-sky-400 group-hover:text-sky-300" />
                      <span className="font-semibold text-sky-300">Breather</span>
                      <span className="text-sm bg-sky-900/50 text-sky-300 px-3 py-1 rounded-full border border-sky-800/50">5 min</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={() => setLeaveOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
                >
                  <CalendarDays className="w-5 h-5" />
                  <span>Apply Leave</span>
                </button>

                <button
                  onClick={downloadExcel}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
                >
                  <button
  onClick={() => {
    console.log('=== DEBUG ATTENDANCE DATA ===');
    console.log('Total records:', attendanceData.length);
    
    // Show SHIFT_START and SHIFT_END records
    const shiftStarts = attendanceData.filter(r => r.action === 'SHIFT_START');
    const shiftEnds = attendanceData.filter(r => r.action === 'SHIFT_END');
    
    console.log('SHIFT_START records:', shiftStarts.length);
    console.log('SHIFT_END records:', shiftEnds.length);
    
    // Show sample records
    if (shiftStarts.length > 0) {
      console.log('Sample SHIFT_START:', {
        empId: shiftStarts[0].empId,
        timestamp: shiftStarts[0].timestamp,
        date: shiftStarts[0].date,
        time: shiftStarts[0].time
      });
    }
    
    if (shiftEnds.length > 0) {
      console.log('Sample SHIFT_END:', {
        empId: shiftEnds[0].empId,
        timestamp: shiftEnds[0].timestamp,
        workingHours: shiftEnds[0].workingHours
      });
    }
    
    // Check if records can be matched
    const matchedPairs = [];
    shiftStarts.forEach(start => {
      const matchingEnd = shiftEnds.find(end => 
        end.empId === start.empId && 
        end.date === start.date
      );
      
      if (matchingEnd) {
        matchedPairs.push({ start, end: matchingEnd });
      }
    });
    
    console.log('Matched start/end pairs:', matchedPairs.length);
    
    alert(`Attendance Data Debug:\n
    Total Records: ${attendanceData.length}\n
    SHIFT_START: ${shiftStarts.length}\n
    SHIFT_END: ${shiftEnds.length}\n
    Matched Pairs: ${matchedPairs.length}\n
    Check console for details.`);
  }}
  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm"
>
  🔍 Debug Data
</button>
                  <Download className="w-5 h-5" />
                  <span>Download Report</span>
                </button>
                
                <button
                  onClick={sendCustomEmailToEmployee}
                  disabled={!empEmail}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-5 h-5" />
                  <span>Email Employee</span>
                </button>
                
                <button
                  onClick={sendDailySummaryToAll}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Daily Summary</span>
                </button>
                
                <button
                  onClick={async () => {
                    setEmailStatus('Sending test email...');
                    const result = await sendRealEmail(
                      empEmail || MANAGER.email,
                      'Test Email from Attendance Portal',
                      '<h1>Test Email</h1><p>This is a test email from your attendance portal.</p>'
                    );
                    if (result.success) {
                      setEmailStatus('✅ Test email sent successfully!');
                      alert('Test email sent! Check your inbox.');
                    } else {
                      setEmailStatus('❌ Failed to send test email');
                    }
                  }}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Test Email</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Alerts */}
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
                            {alert.exceededBy && (
                              <span className="ml-2 px-2 py-0.5 bg-red-900/30 text-red-300 rounded-full text-xs">
                                +{alert.exceededBy} min
                              </span>
                            )}
                            {alert.message.includes('Email') && (
                              <span className="ml-2 px-2 py-0.5 bg-emerald-900/30 text-emerald-300 rounded-full text-xs">
                                ✓ Email sent
                              </span>
                            )}
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
        </div>
      </main>

      {/* Break Over Modal */}
      <Modal isOpen={showBreakOverModal} onClose={() => setShowBreakOverModal(false)}>
        <div className="text-center p-2">
          <div className="w-16 h-16 bg-gradient-to-r from-red-900 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-300" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">⏰ Break Time Exceeded!</h3>
          <p className="text-gray-300 mb-4">
            {activeBreak?.type} break time is over!
            {alerts[0]?.exceededBy && ` Exceeded by ${alerts[0]?.exceededBy} minute(s).`}
          </p>
          
          {emailStatus && (
            <div className={`p-3 rounded-lg mb-4 ${
              emailStatus.includes('✅') 
                ? 'bg-emerald-900/30 border border-emerald-800/50 text-emerald-300'
                : emailStatus.includes('❌')
                ? 'bg-red-900/30 border border-red-800/50 text-red-300'
                : 'bg-blue-900/30 border border-blue-800/50 text-blue-300'
            }`}>
              <div className="flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" />
                <span className="text-sm">{emailStatus}</span>
              </div>
              {emailStatus.includes('✅') && (
                <p className="text-xs mt-1 opacity-80">
                  Both you and manager have been notified via email
                </p>
              )}
            </div>
          )}
          
          <div className="bg-amber-900/30 border border-amber-800/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-300 flex items-center justify-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>Emails sent to:</span>
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-blue-300">👨‍💼 Manager: <strong>{MANAGER.email}</strong></p>
              <p className="text-green-300">👤 You: <strong>{empEmail}</strong></p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setShowBreakOverModal(false);
              if (activeBreak) endBreak();
            }}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all hover:scale-105"
          >
            Acknowledge & End Break
          </button>
        </div>
      </Modal>

      {/* Leave Modal */}
      <Modal isOpen={leaveOpen} onClose={() => setLeaveOpen(false)} title="Apply for Leave">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={leaveData.from}
              onChange={(e) => setLeaveData({...leaveData, from: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={leaveData.to}
              onChange={(e) => setLeaveData({...leaveData, to: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Reason for Leave
            </label>
            <textarea
              value={leaveData.reason}
              onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Please provide a detailed reason..."
            />
          </div>

          <div className="bg-blue-900/30 border border-blue-800/50 p-4 rounded-lg">
            <div className="flex items-center">
              <Send className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-300">Email Notification</p>
                <p className="text-xs text-blue-400/80">
                  Will be sent to: <strong className="text-blue-300">{MANAGER.email}</strong>
                </p>
                <p className="text-xs text-green-400/80 mt-1">
                  You will also receive a confirmation email at: <strong>{empEmail}</strong>
                </p>
              </div>
            </div>
          </div>

          {emailStatus && emailStatus.includes('leave') && (
            <div className="p-3 bg-emerald-900/30 border border-emerald-800/50 rounded-lg">
              <p className="text-sm text-emerald-300 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {emailStatus}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              onClick={() => setLeaveOpen(false)}
              className="px-4 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLeaveSubmit}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
              <span>Submit & Send Emails</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 border-t border-gray-800 mt-8">
        <div className="text-center text-gray-500 text-sm">
          <p>Nova TechSciences Attendance Portal v2.0</p>
          <p className="mt-1">Email Notifications Active • All employee communications enabled</p>
          <p className="mt-2 text-xs text-gray-600">
            Manager: {MANAGER.name} • {MANAGER.email}
          </p>
        </div>
      </footer>
    </div>
  );
}