/**
 * emailService.js
 * =============================================================================
 * Purpose: Sends a styled HTML confirmation email with the PDF ticket attached.
 *
 * Exports:
 *  - sendTicketConfirmationEmail({ to, student, event, ticketCode, pdfBuffer })
 *
 * Dependencies: nodemailer (already configured in config/mail.js)
 * =============================================================================
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// ─── Shared transporter (re-uses the same Gmail SMTP settings as mail.js) ───
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (raw) => {
    if (!raw) return 'TBD';
    return new Date(raw).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
};

const formatTime = (raw) => {
    if (!raw) return 'TBD';
    return new Date(raw).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true,
    });
};

// ─── HTML Email Template ──────────────────────────────────────────────────────

const buildEmailHTML = ({ student, event, ticketCode }) => /* html */`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Event Ticket</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Segoe UI',Arial,sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.10);">

          <!-- ── Header ── -->
          <tr>
            <td style="background:#1A1033;padding:32px 40px;">
              <h1 style="margin:0;color:#FFFFFF;font-size:26px;font-weight:700;
                         letter-spacing:-0.5px;">EventSphere</h1>
              <p style="margin:6px 0 0;color:#22D3EE;font-size:11px;
                        letter-spacing:1.5px;text-transform:uppercase;">
                Smart College Event Management Portal
              </p>
            </td>
          </tr>

          <!-- ── Accent bar ── -->
          <tr><td style="background:#22D3EE;height:4px;"></td></tr>

          <!-- ── Hero message ── -->
          <tr>
            <td style="background:#FFFFFF;padding:40px 40px 32px;">
              <div style="text-align:center;margin-bottom:28px;">
                <span style="font-size:48px;">🎉</span>
                <h2 style="margin:12px 0 6px;color:#1A1033;font-size:22px;font-weight:700;">
                  You're In! Registration Approved.
                </h2>
                <p style="margin:0;color:#6B7280;font-size:14px;line-height:1.6;">
                  Hi <strong style="color:#6C3AE3;">${student.name || 'there'}</strong>,
                  your registration has been confirmed by the event organiser.
                  Your ticket is attached to this email as a PDF.
                </p>
              </div>

              <!-- ── Event details card ── -->
              <div style="background:#F9FAFB;border:1px solid #E5E7EB;
                          border-radius:12px;padding:24px;margin-bottom:24px;">
                <h3 style="margin:0 0 16px;color:#6C3AE3;font-size:13px;
                           font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                  Event Details
                </h3>

                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="padding-bottom:16px;vertical-align:top;">
                      <p style="margin:0 0 2px;color:#9CA3AF;font-size:11px;
                                text-transform:uppercase;letter-spacing:0.8px;">Event</p>
                      <p style="margin:0;color:#1F2937;font-size:14px;font-weight:600;">
                        ${event.title || 'Event'}
                      </p>
                    </td>
                    <td width="50%" style="padding-bottom:16px;vertical-align:top;">
                      <p style="margin:0 0 2px;color:#9CA3AF;font-size:11px;
                                text-transform:uppercase;letter-spacing:0.8px;">Category</p>
                      <p style="margin:0;color:#1F2937;font-size:14px;font-weight:600;">
                        ${event.category || 'General'}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%" style="padding-bottom:16px;vertical-align:top;">
                      <p style="margin:0 0 2px;color:#9CA3AF;font-size:11px;
                                text-transform:uppercase;letter-spacing:0.8px;">📅 Date</p>
                      <p style="margin:0;color:#1F2937;font-size:14px;font-weight:600;">
                        ${formatDate(event.date)}
                      </p>
                    </td>
                    <td width="50%" style="padding-bottom:16px;vertical-align:top;">
                      <p style="margin:0 0 2px;color:#9CA3AF;font-size:11px;
                                text-transform:uppercase;letter-spacing:0.8px;">🕐 Time</p>
                      <p style="margin:0;color:#1F2937;font-size:14px;font-weight:600;">
                        ${formatTime(event.date)}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="vertical-align:top;">
                      <p style="margin:0 0 2px;color:#9CA3AF;font-size:11px;
                                text-transform:uppercase;letter-spacing:0.8px;">📍 Location</p>
                      <p style="margin:0;color:#1F2937;font-size:14px;font-weight:600;">
                        ${event.location || 'TBD'}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- ── Ticket code highlight ── -->
              <div style="background:#EDE9FE;border-left:4px solid #6C3AE3;
                          border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0 0 4px;color:#5B21B6;font-size:11px;font-weight:700;
                           text-transform:uppercase;letter-spacing:0.8px;">Your Ticket Code</p>
                <p style="margin:0;color:#1A1033;font-size:20px;font-weight:800;
                           letter-spacing:2px;">${ticketCode}</p>
              </div>

              <!-- ── Instructions ── -->
              <div style="background:#ECFDF5;border:1px solid #A7F3D0;
                          border-radius:10px;padding:18px 20px;margin-bottom:8px;">
                <h4 style="margin:0 0 10px;color:#065F46;font-size:13px;font-weight:700;">
                  📋 What to bring on the day
                </h4>
                <ul style="margin:0;padding-left:18px;color:#374151;font-size:13px;
                           line-height:1.8;">
                  <li>This email or the attached <strong>PDF ticket</strong></li>
                  <li>Your college ID card</li>
                  <li>The QR code in the PDF for quick entry scanning</li>
                  <li>Arrive <strong>15 minutes early</strong> for check-in</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background:#1A1033;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#9CA3AF;font-size:12px;">
                EventSphere — Smart College Event Management Portal
              </p>
              <p style="margin:0;color:#4B5563;font-size:11px;">
                This is an automated email. Please do not reply directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Sends the ticket confirmation email with PDF attachment.
 *
 * @param {Object} params
 * @param {string}       params.to          - Student's email address
 * @param {Object}       params.student     - Populated student User document
 * @param {Object}       params.event       - Populated Event document
 * @param {string}       params.ticketCode  - Unique ticket identifier
 * @param {Buffer}       params.pdfBuffer   - PDF bytes from ticketService
 * @returns {Promise<Object>}               - Nodemailer info object
 */
export const sendTicketConfirmationEmail = async ({
    to,
    student,
    event,
    ticketCode,
    pdfBuffer,
}) => {
    const safeFilename = `EventSphere-Ticket-${ticketCode}.pdf`;

    const mailOptions = {
        from: `"EventSphere 🎟️" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Your Event Ticket is Confirmed 🎉 — ${event.title || 'Event'}`,
        text: [
            `Hi ${student.name || 'there'},`,
            '',
            `Great news! Your registration for "${event.title}" has been approved.`,
            '',
            `Event Details:`,
            `  • Date:     ${formatDate(event.date)}`,
            `  • Time:     ${formatTime(event.date)}`,
            `  • Location: ${event.location || 'TBD'}`,
            `  • Ticket:   ${ticketCode}`,
            '',
            `Your PDF ticket is attached. Please bring it (digital or printed) to the event.`,
            '',
            `— EventSphere Team`,
        ].join('\n'),
        html: buildEmailHTML({ student, event, ticketCode }),
        attachments: [
            {
                filename: safeFilename,
                content: pdfBuffer,
                contentType: 'application/pdf',
            },
        ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [emailService] Ticket email sent to ${to} | messageId: ${info.messageId}`);
    return info;
};
