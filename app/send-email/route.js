export async function POST(request) {
  try {
    const { to, subject, htmlContent } = await request.json();
    
    // EmailJS server-side implementation
    const EmailJSResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: to,
          subject: subject,
          message: htmlContent,
        },
      }),
    });

    if (!EmailJSResponse.ok) {
      throw new Error('Failed to send email via EmailJS');
    }

    return Response.json({
      success: true,
      message: 'Email sent via EmailJS',
    });
    
  } catch (error) {
    console.error('EmailJS API error:', error);
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}