// /utils/emailService.js
// This is the client-side email service that calls the API

// Main email sending function
export const sendRealEmail = async (to, subject, htmlContent, emailType = null, emailData = null) => {
  try {
    console.log('📧 Client: Sending email via API...');
    console.log('📨 To:', to);
    console.log('📝 Subject:', subject);
    console.log('🎨 Type:', emailType || 'Custom');
    console.log('📄 Content length:', htmlContent?.length || 0);
    
    const payload = {
      to,
      subject,
      htmlContent,
    };
    
    // Add emailType and emailData if provided
    if (emailType) {
      payload.emailType = emailType;
    }
    
    if (emailData) {
      payload.emailData = emailData;
    }
    
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.error || 'Failed to send email');
    }

    console.log('✅ Email sent successfully:', data);
    return { 
      success: true, 
      message: 'Email sent successfully',
      data 
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Custom email to specific employee
export const sendCustomEmailToEmployee = async ({ empEmail, empName, setEmailStatus }) => {
  if (!empEmail) {
    alert('Please select an employee first');
    return { success: false, message: 'No employee selected' };
  }

  const subject = prompt('Enter email subject:');
  if (!subject) {
    return { success: false, message: 'Subject required' };
  }

  const message = prompt('Enter email message:');
  if (!message) {
    return { success: false, message: 'Message required' };
  }

  // Update status
  if (setEmailStatus) {
    setEmailStatus(`Sending email to ${empName}...`);
  }

  try {
    const htmlContent = `
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
    `;
    
    console.log('📧 Sending custom email to:', empEmail);
    console.log('📝 Subject:', subject);
    console.log('📄 Message length:', message.length);

    const result = await sendRealEmail(empEmail, subject, htmlContent);

    if (setEmailStatus) {
      setEmailStatus(`✅ Email sent to ${empName}!`);
    }
    
    alert('Email sent successfully!');
    return result;

  } catch (error) {
    console.error('Error sending custom email:', error);
    
    if (setEmailStatus) {
      setEmailStatus('❌ Failed to send email');
    }
    
    alert('Failed to send email. Please try again.');
    return { success: false, message: error.message };
  }
};

// Daily summary to all employees
export const sendDailySummaryToAll = async ({ employees, ADMIN_PASSWORD, setEmailStatus }) => {
  const password = prompt('Enter admin password to send daily summary:');
  if (password !== ADMIN_PASSWORD) {
    alert('Incorrect password');
    return { success: false, message: 'Incorrect admin password' };
  }

  if (setEmailStatus) {
    setEmailStatus('Sending daily summaries to all employees...');
  }

  try {
    const today = new Date().toLocaleDateString('en-IN');
    let successCount = 0;
    let failCount = 0;

    for (const employee of employees) {
      if (employee.email) {
        try {
          const htmlContent = `
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
          `;
          
          console.log(`📧 Sending daily summary to: ${employee.email}`);
          
          await sendRealEmail(
            employee.email,
            `📈 Daily Attendance Summary - ${today}`,
            htmlContent
          );
          
          successCount++;
          console.log(`✅ Sent to ${employee.name}`);
          
        } catch (error) {
          console.error(`❌ Failed to send to ${employee.email}:`, error);
          failCount++;
        }
      }
    }

    const message = `✅ Daily summaries sent! Success: ${successCount}, Failed: ${failCount}`;
    
    if (setEmailStatus) {
      setEmailStatus(message);
    }
    
    alert(`Daily summaries sent to ${successCount} employees. ${failCount} failed.`);
    
    return {
      success: failCount === 0,
      message,
      successCount,
      failCount,
      total: employees.length
    };

  } catch (error) {
    console.error('❌ Error sending daily summaries:', error);
    
    if (setEmailStatus) {
      setEmailStatus('❌ Failed to send daily summaries');
    }
    
    alert('Failed to send daily summaries. Please try again.');
    return { success: false, message: error.message };
  }
};

// Send shift start notification
export const sendShiftStartEmail = async (employeeEmail, employeeName) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981; text-align: center;">Shift Started Successfully</h2>
        <div style="background-color: #ecfdf5; padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #047857;">Hello ${employeeName},</h3>
          <p>Your shift has been started successfully at <strong>${new Date().toLocaleTimeString()}</strong>.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #10b981; border-radius: 5px;">
            <p><strong>Employee:</strong> ${employeeName}</p>
            <p><strong>Start Time:</strong> ${new Date().toLocaleTimeString()}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p style="color: #666; margin-top: 20px;">
            Have a productive day! Remember to take breaks and stay hydrated.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px;">
            Nova TechSciences Attendance System<br>
            Automated Notification
          </p>
        </div>
      </div>
    `;
    
    return await sendRealEmail(
      employeeEmail,
      'Shift Started - Nova TechSciences',
      htmlContent,
      'shiftStarted',
      { employeeName, employeeEmail }
    );
  } catch (error) {
    console.error('Error sending shift start email:', error);
    throw error;
  }
};

// Send shift end notification
export const sendShiftEndEmail = async (employeeEmail, employeeName, shiftDuration) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6; text-align: center;">Shift Ended Successfully</h2>
        <div style="background-color: #eff6ff; padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #1d4ed8;">Hello ${employeeName},</h3>
          <p>Your shift has been ended successfully at <strong>${new Date().toLocaleTimeString()}</strong>.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #3b82f6; border-radius: 5px;">
            <p><strong>Employee:</strong> ${employeeName}</p>
            <p><strong>End Time:</strong> ${new Date().toLocaleTimeString()}</p>
            <p><strong>Shift Duration:</strong> ${shiftDuration}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p style="color: #666; margin-top: 20px;">
            Thank you for your hard work today! Have a good rest.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
          <p style="color: #999; font-size: 12px;">
            Nova TechSciences Attendance System<br>
            Automated Notification
          </p>
        </div>
      </div>
    `;
    
    return await sendRealEmail(
      employeeEmail,
      'Shift Ended - Nova TechSciences',
      htmlContent
    );
  } catch (error) {
    console.error('Error sending shift end email:', error);
    throw error;
  }
};

// Test function
export const testEmailService = async () => {
  try {
    console.log('🧪 Testing email service...');
    const result = await sendRealEmail(
      'test@example.com',
      'Test Email from Nova TechSciences',
      '<h1>Test Email</h1><p>This is a test email from the Nova TechSciences system.</p>'
    );
    console.log('✅ Test result:', result);
    return result;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, error: error.message };
  }
};