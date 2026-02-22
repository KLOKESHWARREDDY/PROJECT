import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Transporter with Gmail SMTP Settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Sends a welcome email to the newly registered user.
 * @param {string} toEmail - The recipient's email address
 */
export const sendWelcomeEmail = async (toEmail) => {
    try {
        console.log(`✉️  Attempting to send welcome email to: ${toEmail}`);

        const info = await transporter.sendMail({
            from: `"Our Platform" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Welcome to Our Platform',
            text: 'Your account has been created successfully.',
            html: '<p>Your account has been created successfully.</p>',
        });

        console.log(`✅ Welcome email sent successfully! Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send welcome email to ${toEmail}:`, error.message);
        throw error;
    }
};

/**
 * Sends a password reset email with a JWT token link.
 * @param {string} toEmail - The recipient's email address
 * @param {string} resetUrl - The secure URL with the token
 */
export const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    try {
        console.log(`✉️  Attempting to send password reset email to: ${toEmail}`);

        const info = await transporter.sendMail({
            from: `"Our Platform" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: 'Password Reset Request',
            text: `Click the link below to reset your password:\n${resetUrl}\nThis link expires in 10 minutes.`,
            html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 10 minutes.</p>
      `,
        });

        console.log(`✅ Password reset email sent successfully! Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`❌ Failed to send password reset email to ${toEmail}:`, error.message);
        throw error;
    }
};
