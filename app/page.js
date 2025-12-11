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
  const startShift = async () => {
    if (!empId) {
      alert('Please select an employee first');
      return;
    }

    setShiftStarted(true);
    const now = new Date();
    setShiftStartTime(now);
    
    const newRecord = {
      empId,
      empName,
      action: 'SHIFT_START',
      timestamp: now.toISOString(),
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN'),
    };
    
    setAttendanceData(prev => [...prev, newRecord]);
    
    setEmailStatus('Sending shift start notifications...');
    
    try {
      // Send to MANAGER
      if (notificationSettings.shiftStart) {
        await sendRealEmail(
          MANAGER.email,
          `✅ Shift Started - ${empName}`,
          '',
          'shiftStarted',
          {
            employeeName: empName,
            employeeId: empId,
            shiftStartTime: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
          }
        );
      }
      
      // Send to EMPLOYEE
      if (notificationSettings.shiftStart && empEmail) {
        await sendRealEmail(
          empEmail,
          `🏁 Shift Started Successfully - ${empName}`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #059669; text-align: center;">Shift Started Successfully</h2>
              <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Employee:</strong> ${empName} (${empId})</p>
                <p><strong>Shift Started:</strong> ${now.toLocaleTimeString()}</p>
                <p><strong>Date:</strong> ${now.toLocaleDateString()}</p>
                <p><strong>Shift Timing:</strong> ${currentEmployee?.shift || 'Regular Shift'}</p>
              </div>
              <p style="color: #666; font-size: 14px;">Your shift has been logged. You can now take breaks using the portal.</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
              <p style="text-align: center; color: #999; font-size: 12px;">
                Nova TechSciences Attendance Portal<br>
                This is an automated notification
              </p>
            </div>
          `
        );
      }
      
      setEmailStatus('✅ Shift start notifications sent!');
      
    } catch (error) {
      console.error('Error sending shift start emails:', error);
      setEmailStatus('❌ Failed to send some notifications');
    }
  };

  // End Shift - SEND SUMMARY TO EMPLOYEE
  const endShift = async () => {
    if (!shiftStarted) return;

    const now = new Date();
    const workingHours = calculateWorkingHours(shiftStartTime, now, totalBreakTime);

    const newRecord = {
      empId,
      empName,
      action: 'SHIFT_END',
      timestamp: now.toISOString(),
      workingHours,
      totalBreaks: totalBreakTime,
    };
    
    setAttendanceData(prev => [...prev, newRecord]);

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

    } catch (error) {
      console.error('Error sending shift end emails:', error);
      setEmailStatus('❌ Failed to send summary');
    }

    // Reset state
    setShiftStarted(false);
    setShiftStartTime(null);
    setTotalBreakTime(0);
    setActiveBreak(null);
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

      if (attendanceData.length > 0) {
        const attendanceSheetData = attendanceData.map(record => ({
          Date: record.date,
          Time: record.time,
          'Employee ID': record.empId,
          'Employee Name': record.empName,
          'Employee Email': employees.find(e => e.id === record.empId)?.email || 'N/A',
          Action: record.action,
          'Working Hours': record.workingHours || '',
          'Total Breaks': record.totalBreaks || 0,
        }));
        const ws1 = XLSX.utils.json_to_sheet(attendanceSheetData);
        XLSX.utils.book_append_sheet(wb, ws1, 'Attendance Logs');
      }

      if (leaveDataLocal.length > 0) {
        const leaveSheetData = leaveDataLocal.map(record => ({
          'Employee ID': record.empId,
          'Employee Name': record.empName,
          'Employee Email': employees.find(e => e.id === record.empId)?.email || 'N/A',
          'From Date': record.fromDate,
          'To Date': record.toDate,
          Reason: record.reason,
          Status: record.status,
          'Applied On': new Date(record.appliedOn).toLocaleDateString('en-IN'),
        }));
        const ws2 = XLSX.utils.json_to_sheet(leaveSheetData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Leave Requests');
      }

      // Add employee directory sheet
      const employeeSheetData = employees.map(emp => ({
        'Employee ID': emp.id,
        'Employee Name': emp.name,
        'Email': emp.email,
        'Phone': emp.phone,
        'Shift Timing': emp.shift,
      }));
      const ws3 = XLSX.utils.json_to_sheet(employeeSheetData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Employee Directory');

      XLSX.writeFile(wb, `NTS_Attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading Excel:', error);
      alert('Failed to download report');
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