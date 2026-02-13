const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

// Send approval email
const sendApprovalEmail = async (toEmail, studentName, eventTitle, ticketCode, eventDate, eventLocation) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"EventSphere" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `🎉 Registration Approved! Your Ticket for ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .ticket-box { background: white; border: 2px dashed #6366f1; padding: 20px; margin: 20px 0; border-radius: 10px; text-align: center; }
            .ticket-code { font-size: 24px; font-weight: bold; color: #6366f1; letter-spacing: 2px; }
            .details { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .btn { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You're In!</h1>
              <p>Your registration has been approved</p>
            </div>
            <div class="content">
              <p>Hi <strong>${studentName}</strong>,</p>
              <p>Great news! Your registration for <strong>${eventTitle}</strong> has been approved.</p>
              
              <div class="ticket-box">
                <p style="margin: 0; color: #6b7280;">Your Ticket Code</p>
                <p class="ticket-code">${ticketCode}</p>
              </div>
              
              <div class="details">
                <h3 style="margin-top: 0; color: #1f2937;">Event Details</h3>
                <p><strong>📅 Date:</strong> ${new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>📍 Location:</strong> ${eventLocation}</p>
              </div>
              
              <p style="color: #6b7280;">Please save this email or take a screenshot of your ticket code. You'll need it to check in at the event.</p>
              
              <div style="text-align: center;">
                <p style="color: #6b7280;">Thank you for using EventSphere!</p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EventSphere. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Send rejection email
const sendRejectionEmail = async (toEmail, studentName, eventTitle, eventDate, reason) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"EventSphere" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Registration Update for ${eventTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Update</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${studentName}</strong>,</p>
              <p>Unfortunately, your registration for <strong>${eventTitle}</strong> has not been approved.</p>
              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
              <p>Don't worry! There are plenty of other events you can join.</p>
              <p>Thank you for your interest.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EventSphere. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Rejection email failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
};
