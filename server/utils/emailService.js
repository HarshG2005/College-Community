import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const hasEmailCredentials = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

let transporter = null;
if (hasEmailCredentials) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
}

/**
 * Send an announcement email to multiple recipients.
 * If email credentials are not configured, logs the announcement instead.
 * @param {string[]} recipients - Array of email addresses
 * @param {string} subject - Email subject
 * @param {string} content - HTML or plain text content
 */
export const sendAnnouncement = async (recipients, subject, content) => {
    // If no email credentials, simulate success and log
    if (!hasEmailCredentials || !transporter) {
        console.log('📋 [Email Fallback] No SMTP credentials configured.');
        console.log(`📢 Announcement: "${subject}"`);
        console.log(`👥 Would have sent to ${recipients.length} recipients.`);
        console.log(`📝 Content: ${content}`);
        return {
            success: true,
            fallback: true,
            message: `Announcement logged for ${recipients.length} recipients (email not configured).`
        };
    }

    try {
        const mailOptions = {
            from: `"BMSIT&M Community Platform" <${process.env.EMAIL_USER}>`,
            to: recipients.join(','),
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #10b981; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                        <h1 style="color: white; margin: 0;">BMSIT&M Community</h1>
                    </div>
                    <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 8px 8px;">
                        <h2>${subject}</h2>
                        <p>${content}</p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #888; font-size: 12px;">This is an automated message from the BMSIT&M College Community Platform.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        // Fallback: log the announcement even if email fails
        console.log(`📋 [Fallback] Announcement "${subject}" logged for ${recipients.length} recipients.`);
        return {
            success: true,
            fallback: true,
            message: `Email failed (${error.message}), but announcement was logged for ${recipients.length} recipients.`
        };
    }
};

export default { sendAnnouncement };
