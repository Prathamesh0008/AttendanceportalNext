import nodemailer from 'nodemailer';

// Email Templates
const emailTemplates = {
  breakExceeded: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .details { background: white; padding: 20px; border-radius: 5px; border: 1px solid #ddd; }
        .detail-row { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; width: 150px; color: #555; }
        .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⏰ Nova TechSciences</div>
          <h1>Break Time Exceeded Alert</h1>
        </div>
        <div class="content">
          <div class="alert">
            <strong>⚠️ Attention Required:</strong> ${data.employeeName} has exceeded their ${data.breakType} break time.
          </div>
          
          <div class="details">
            <h3>Employee Details</h3>
            <div class="detail-row">
              <span class="detail-label">Employee Name:</span>
              <span>${data.employeeName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Employee ID:</span>
              <span>${data.employeeId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Break Type:</span>
              <span>${data.breakType} Break</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Allowed Time:</span>
              <span>${data.allowedMinutes} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Actual Time:</span>
              <span>${data.actualMinutes} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Exceeded By:</span>
              <span style="color: #e74c3c; font-weight: bold;">${data.exceededBy} minutes</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time of Alert:</span>
              <span>${new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #e8f4fd; border-radius: 5px;">
            <h4>📋 Required Action</h4>
            <p>Please review this with the employee during their next 1:1 meeting.</p>
          </div>
        </div>
        <div class="footer">
          <p>Nova TechSciences Attendance Portal | Precision | Purity | Progress</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  shiftSummary: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .summary-box { background: white; padding: 25px; border-radius: 10px; border: 2px solid #e3e3e3; margin: 20px 0; }
        .stat { display: flex; justify-content: space-between; margin: 15px 0; padding: 12px; background: #f8f9fa; border-radius: 5px; }
        .stat-label { font-weight: 600; color: #555; }
        .stat-value { font-weight: bold; color: #2c3e50; }
        .working-hours { font-size: 24px; color: #27ae60; font-weight: bold; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .highlight { background: #e3f2fd; padding: 10px; border-radius: 5px; border-left: 4px solid #2196f3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📊 Nova TechSciences</div>
          <h1>Daily Shift Summary</h1>
        </div>
        <div class="content">
          <div class="highlight">
            <p>Hello <strong>${data.employeeName}</strong>,</p>
            <p>Here's your shift summary for ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary-box">
            <h3>📋 Shift Details</h3>
            <div class="stat">
              <span class="stat-label">Shift Start:</span>
              <span class="stat-value">${data.shiftStart}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Shift End:</span>
              <span class="stat-value">${data.shiftEnd}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Total Breaks:</span>
              <span class="stat-value">${data.totalBreaks} minutes</span>
            </div>
            
            <div class="working-hours">
              ⏱️ Total Working Hours: ${data.workingHours}
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <div style="display: inline-block; padding: 10px 20px; background: #27ae60; color: white; border-radius: 25px; font-weight: bold;">
                ✅ Shift Completed Successfully
              </div>
            </div>
          </div>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h4>🌟 Performance Note</h4>
            <p>Thank you for your dedication and hard work today! Your contribution is valued.</p>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              Note: This summary is generated automatically. For any discrepancies, contact HR.
            </p>
          </div>
        </div>
        <div class="footer">
          <p>Nova TechSciences Attendance Portal | Precision | Purity | Progress</p>
          <p>This is an automated summary. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  leaveApplication: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .request-box { background: white; padding: 25px; border-radius: 10px; border: 2px solid #e3e3e3; margin: 20px 0; }
        .detail { display: flex; margin: 15px 0; padding: 12px; background: #f8f9fa; border-radius: 5px; }
        .detail-label { font-weight: 600; color: #555; min-width: 120px; }
        .detail-value { font-weight: bold; color: #2c3e50; }
        .status { display: inline-block; padding: 8px 16px; background: #ffd166; color: #000; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        .action-buttons { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; padding: 12px 30px; margin: 0 10px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .btn-approve { background: #06d6a0; color: white; }
        .btn-reject { background: #ef476f; color: white; }
        .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .urgent { background: #ffeaa7; padding: 10px; border-radius: 5px; border-left: 4px solid #fdcb6e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📅 Nova TechSciences</div>
          <h1>Leave Application Request</h1>
        </div>
        <div class="content">
          <div class="urgent">
            <p>📬 <strong>New Leave Request Requires Your Approval</strong></p>
          </div>
          
          <div class="request-box">
            <h3>👤 Employee Information</h3>
            <div class="detail">
              <span class="detail-label">Employee Name:</span>
              <span class="detail-value">${data.employeeName}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Employee ID:</span>
              <span class="detail-value">${data.employeeId}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Applied On:</span>
              <span class="detail-value">${new Date().toLocaleString()}</span>
            </div>
            
            <h3 style="margin-top: 30px;">📋 Leave Details</h3>
            <div class="detail">
              <span class="detail-label">From Date:</span>
              <span class="detail-value">${data.fromDate}</span>
            </div>
            <div class="detail">
              <span class="detail-label">To Date:</span>
              <span class="detail-value">${data.toDate}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Total Days:</span>
              <span class="detail-value">${calculateLeaveDays(data.fromDate, data.toDate)} days</span>
            </div>
            
            <h3 style="margin-top: 30px;">📝 Reason for Leave</h3>
            <div style="background: #f1f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p style="font-style: italic;">"${data.reason}"</p>
            </div>
            
            <div class="status">
              ⏳ Status: Pending Approval
            </div>
            
            <div class="action-buttons">
              <p><strong>Action Required:</strong> Please review and take appropriate action</p>
              <p style="font-size: 12px; color: #666;">(Note: These buttons are for reference only)</p>
            </div>
          </div>
          
          <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h4>📌 Next Steps</h4>
            <ol>
              <li>Review the leave request details</li>
              <li>Check team coverage for the requested dates</li>
              <li>Approve or reject the request in the HR system</li>
              <li>Notify the employee of your decision</li>
            </ol>
          </div>
        </div>
        <div class="footer">
          <p>Nova TechSciences HR Portal | Precision | Purity | Progress</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  shiftStarted: (data) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .info-box { background: white; padding: 25px; border-radius: 10px; border: 2px solid #e3e3e3; margin: 20px 0; }
        .detail { display: flex; margin: 12px 0; }
        .detail-label { font-weight: 600; color: #555; width: 150px; }
        .detail-value { font-weight: bold; color: #2c3e50; }
        .welcome { text-align: center; margin: 25px 0; }
        .emoji { font-size: 48px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✅ Nova TechSciences</div>
          <h1>Shift Started Notification</h1>
        </div>
        <div class="content">
          <div class="welcome">
            <div class="emoji">👋</div>
            <h2>Welcome to Your Shift!</h2>
            <p>${data.employeeName} has started their workday</p>
          </div>
          
          <div class="info-box">
            <h3>📋 Shift Information</h3>
            <div class="detail">
              <span class="detail-label">Employee Name:</span>
              <span class="detail-value">${data.employeeName}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Employee ID:</span>
              <span class="detail-value">${data.employeeId}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Shift Start Time:</span>
              <span class="detail-value">${data.shiftStartTime}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${new Date().toLocaleDateString()}</span>
            </div>
            <div class="detail">
              <span class="detail-label">Current Status:</span>
              <span class="detail-value" style="color: #27ae60;">● Active & Working</span>
            </div>
          </div>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h4>💡 Reminders</h4>
            <ul>
              <li>Remember to take regular breaks as per company policy</li>
              <li>Log your tasks in the project management system</li>
              <li>Stay hydrated and maintain good posture</li>
              <li>Reach out to your manager if you need assistance</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 25px; padding: 15px; background: #e8f6f3; border-radius: 5px;">
            <p style="font-weight: bold;">Have a productive day! 🚀</p>
          </div>
        </div>
        <div class="footer">
          <p>Nova TechSciences Attendance Portal | Precision | Purity | Progress</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// Helper function to calculate leave days
function calculateLeaveDays(fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = Math.abs(to - from);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

export async function POST(request) {
  try {
    const { to, subject, htmlContent, emailType, emailData } = await request.json();
    
    console.log('📧 Sending email to:', to);
    console.log('📝 Subject:', subject);
    console.log('📊 Email Type:', emailType);
    
    // Check if we have Gmail credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️ Using test mode - emails will be logged but not sent');
      
      // Simulate success for testing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('📤 Email would be sent to:', to);
      console.log('📄 Type:', emailType || 'Custom');
      
      return Response.json({
        success: true,
        message: 'Email simulated (add Gmail credentials to .env.local for real emails)',
        to,
        subject,
        simulated: true,
      });
    }
    
    console.log('✅ Using Gmail credentials from .env.local');
    
    // Create transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Use template if emailType is provided, otherwise use custom htmlContent
    let finalHtmlContent = htmlContent;
    
    if (emailType && emailTemplates[emailType] && emailData) {
      finalHtmlContent = emailTemplates[emailType](emailData);
    } else if (emailType && emailTemplates[emailType]) {
      finalHtmlContent = emailTemplates[emailType]({ subject, to });
    }
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Nova TechSciences Attendance" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: finalHtmlContent || '<p>No content provided</p>',
      text: finalHtmlContent?.replace(/<[^>]*>/g, '') || 'No content provided',
    });
    
    console.log('✅ Email sent via Gmail! Message ID:', info.messageId);
    console.log('📧 From:', process.env.EMAIL_USER);
    console.log('📨 To:', to);
    console.log('🎨 Template used:', emailType || 'Custom');
    
    return Response.json({
      success: true,
      message: 'Email sent successfully via Gmail',
      messageId: info.messageId,
      from: process.env.EMAIL_USER,
      to,
      subject,
      emailType,
    });
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    
    if (error.code === 'EAUTH') {
      console.error('❌ Authentication failed! Check your Gmail credentials in .env.local');
    }
    
    return Response.json(
      { 
        success: false,
        error: error.message,
        errorCode: error.code,
        message: 'Failed to send email',
      },
      { status: 500 }
    );
  }
}