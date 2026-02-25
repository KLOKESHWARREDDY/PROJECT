/**
 * ticketService.js
 * =============================================================================
 * Purpose: Generates a professional PDF ticket for an approved registration.
 *
 * Flow:
 *  1. Receive populated ticket + event + student data
 *  2. Generate a QR code image (base64 PNG) from the ticketCode
 *  3. Build a styled PDF in memory using PDFKit (no disk writes)
 *  4. Resolve with a Buffer containing the finished PDF bytes
 *
 * Dependencies: pdfkit, qrcode (both already in package.json)
 * =============================================================================
 */

import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

// ─── Colour palette ────────────────────────────────────────────────────────
const BRAND_PURPLE = '#6C3AE3';   // primary brand
const BRAND_DARK = '#1A1033';   // header / footer background
const ACCENT_CYAN = '#22D3EE';   // highlight / divider
const TEXT_PRIMARY = '#1F2937';
const TEXT_MUTED = '#6B7280';
const LIGHT_BG = '#F3F4F6';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Formats a raw date string or Date object into a human-readable date.
 * e.g. "Monday, 24 February 2026"
 */
const formatDate = (raw) => {
    if (!raw) return 'TBD';
    return new Date(raw).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Formats a raw date string or Date object into a time string.
 * e.g. "10:30 AM"
 */
const formatTime = (raw) => {
    if (!raw) return 'TBD';
    return new Date(raw).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

// ─── Main Service ────────────────────────────────────────────────────────────

/**
 * Generates a PDF ticket in memory and returns it as a Buffer.
 *
 * @param {Object} params
 * @param {string} params.ticketCode   - Unique ticket identifier
 * @param {Object} params.event        - Populated Event document
 * @param {Object} params.student      - Populated User document (student)
 * @returns {Promise<Buffer>}          - PDF file bytes
 */
export const generateTicketPDF = async ({ ticketCode, event, student }) => {
    // 1. Generate QR code data URL (PNG base64) from ticket code
    const qrPayload = JSON.stringify({
        ticketCode,
        eventId: event._id?.toString(),
        studentId: student._id?.toString(),
    });

    const qrDataURL = await QRCode.toDataURL(qrPayload, {
        width: 300,
        margin: 2,
        color: {
            dark: '#1A1033',
            light: '#FFFFFF',
        },
    });

    // Strip the data: URI prefix to get raw base64
    const qrBase64 = qrDataURL.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(qrBase64, 'base64');

    // 2. Build PDF in memory
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A5', margin: 0, autoFirstPage: true });
            const chunks = [];

            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const WIDTH = doc.page.width;   // A5 ≈ 420 pt
            const HEIGHT = doc.page.height;  // A5 ≈ 595 pt
            const PAD = 30;

            // ── Header band ─────────────────────────────────────────────────────
            doc.rect(0, 0, WIDTH, 90).fill(BRAND_DARK);

            doc
                .fontSize(22)
                .font('Helvetica-Bold')
                .fillColor('#FFFFFF')
                .text('EventSphere', PAD, 18, { align: 'left' });

            doc
                .fontSize(9)
                .font('Helvetica')
                .fillColor(ACCENT_CYAN)
                .text('SMART COLLEGE EVENT MANAGEMENT PORTAL', PAD, 46, { align: 'left' });

            // Ticket badge (top-right)
            doc.roundedRect(WIDTH - 120, 18, 100, 26, 8).fill(BRAND_PURPLE);
            doc
                .fontSize(10)
                .font('Helvetica-Bold')
                .fillColor('#FFFFFF')
                .text('✓ CONFIRMED', WIDTH - 118, 25, { width: 96, align: 'center' });

            // ── Accent bar ───────────────────────────────────────────────────────
            doc.rect(0, 90, WIDTH, 4).fill(ACCENT_CYAN);

            // ── Event title section ──────────────────────────────────────────────
            doc
                .fontSize(16)
                .font('Helvetica-Bold')
                .fillColor(BRAND_PURPLE)
                .text('EVENT TICKET', PAD, 108, { align: 'center', width: WIDTH - PAD * 2 });

            doc
                .fontSize(18)
                .font('Helvetica-Bold')
                .fillColor(TEXT_PRIMARY)
                .text(event.title || 'Event', PAD, 132, { align: 'center', width: WIDTH - PAD * 2 });

            // ── Divider ──────────────────────────────────────────────────────────
            doc
                .moveTo(PAD, 165)
                .lineTo(WIDTH - PAD, 165)
                .strokeColor(ACCENT_CYAN)
                .lineWidth(1.5)
                .stroke();

            // ── Two-column event info ────────────────────────────────────────────
            const COL1_X = PAD;
            const COL2_X = WIDTH / 2 + 5;
            let infoY = 178;

            const drawInfoBlock = (label, value, x, y) => {
                doc
                    .fontSize(7.5)
                    .font('Helvetica')
                    .fillColor(TEXT_MUTED)
                    .text(label.toUpperCase(), x, y);
                doc
                    .fontSize(10)
                    .font('Helvetica-Bold')
                    .fillColor(TEXT_PRIMARY)
                    .text(value || 'N/A', x, y + 12, { width: WIDTH / 2 - PAD - 5 });
            };

            drawInfoBlock('📅  Date', formatDate(event.date), COL1_X, infoY);
            drawInfoBlock('🕐  Time', formatTime(event.date), COL2_X, infoY);
            infoY += 38;
            drawInfoBlock('📍  Location', event.location || 'TBD', COL1_X, infoY);
            drawInfoBlock('🏷️  Category', event.category || 'Event', COL2_X, infoY);

            // ── Divider ──────────────────────────────────────────────────────────
            infoY += 44;
            doc
                .moveTo(PAD, infoY)
                .lineTo(WIDTH - PAD, infoY)
                .strokeColor('#E5E7EB')
                .lineWidth(1)
                .stroke();

            // ── Attendee section ─────────────────────────────────────────────────
            infoY += 12;
            doc
                .fontSize(8)
                .font('Helvetica-Bold')
                .fillColor(BRAND_PURPLE)
                .text('ATTENDEE INFORMATION', PAD, infoY);

            infoY += 14;
            drawInfoBlock('👤  Name', student.name || 'Student', COL1_X, infoY);
            drawInfoBlock('📧  Email', student.email || '', COL2_X, infoY);
            infoY += 38;

            if (student.regNo || student.department) {
                drawInfoBlock('🆔  Reg No', student.regNo || 'N/A', COL1_X, infoY);
                drawInfoBlock('🎓  Department', student.department || 'N/A', COL2_X, infoY);
                infoY += 38;
            }

            // ── Ticket code highlight box ────────────────────────────────────────
            infoY += 4;
            doc.roundedRect(PAD, infoY, WIDTH - PAD * 2, 34, 6).fill(LIGHT_BG);
            doc
                .fontSize(8)
                .font('Helvetica')
                .fillColor(TEXT_MUTED)
                .text('TICKET CODE', PAD + 10, infoY + 5);
            doc
                .fontSize(14)
                .font('Helvetica-Bold')
                .fillColor(BRAND_PURPLE)
                .text(ticketCode, PAD + 10, infoY + 16, { width: WIDTH - PAD * 2 - 20 });

            // ── QR Code ──────────────────────────────────────────────────────────
            infoY += 44;
            const QR_SIZE = 110;
            const QR_X = (WIDTH - QR_SIZE) / 2;

            doc
                .fontSize(8)
                .font('Helvetica')
                .fillColor(TEXT_MUTED)
                .text('Scan this QR code at the event entrance', PAD, infoY, {
                    align: 'center',
                    width: WIDTH - PAD * 2,
                });

            infoY += 14;
            doc.image(qrBuffer, QR_X, infoY, { width: QR_SIZE, height: QR_SIZE });

            // ── Footer band ──────────────────────────────────────────────────────
            const FOOTER_Y = HEIGHT - 52;
            doc.rect(0, FOOTER_Y, WIDTH, 52).fill(BRAND_DARK);

            doc
                .fontSize(7.5)
                .font('Helvetica')
                .fillColor('#9CA3AF')
                .text(
                    `Ticket ID: ${ticketCode}  •  Issued: ${new Date().toLocaleDateString()}  •  EventSphere`,
                    PAD,
                    FOOTER_Y + 10,
                    { align: 'center', width: WIDTH - PAD * 2 },
                );

            doc
                .fontSize(7)
                .fillColor('#6B7280')
                .text(
                    'This ticket is non-transferable. Present this PDF or QR code at the event entrance.',
                    PAD,
                    FOOTER_Y + 25,
                    { align: 'center', width: WIDTH - PAD * 2 },
                );

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
