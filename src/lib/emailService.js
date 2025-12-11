const sendRealEmail = async (type, data) => {
  try {
    let subject, body, toEmail;
    
    switch (type) {
      case 'BREAK_EXCEEDED':
        subject = `⚠️ Break Exceeded: ${data.employeeName}`;
        body = `Employee: ${data.employeeName} (${data.employeeId})\nBreak Type: ${data.breakType}\nExceeded by: ${data.exceededBy} minutes\nAllowed: ${data.allowedMinutes} minutes\nTime: ${new Date().toLocaleTimeString()}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nThis is an automated alert from Nova TechSciences Attendance System.`;
        toEmail = data.managerEmail || 'sprathamesh581@gmail.com';
        break;
        
      case 'LEAVE_APPLICATION':
        subject = `📝 Leave Application: ${data.employeeName}`;
        body = `Employee: ${data.employeeName} (${data.employeeId})\nFrom: ${data.fromDate}\nTo: ${data.toDate}\nReason: ${data.reason}\nApplied: ${new Date().toLocaleDateString('en-IN')}\n\nThis is an automated notification from Nova TechSciences Attendance System.`;
        toEmail = data.managerEmail || 'sprathamesh581@gmail.com';
        break;
        
      case 'SHIFT_SUMMARY':
        subject = `📊 Shift Summary: ${data.employeeName}`;
        body = `Employee: ${data.employeeName}\nShift: ${data.shiftStart} to ${data.shiftEnd}\nBreaks: ${data.totalBreaks} minutes\nWorking: ${data.workingHours}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nThis is an automated summary from Nova TechSciences Attendance System.`;
        toEmail = data.employeeEmail || data.managerEmail || 'sprathamesh581@gmail.com';
        break;
        
      default:
        return { success: false, error: 'Invalid type' };
    }
    
    // Open Gmail compose window - THIS WILL WORK IMMEDIATELY!
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open in new tab
    window.open(gmailUrl, '_blank');
    
    console.log('📧 Opening Gmail compose window for:', toEmail);
    return { success: true, method: 'gmail_redirect' };
    
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
};