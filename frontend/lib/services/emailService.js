import nodemailer from 'nodemailer';

// Create transporter with Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Kurdish email template for expired membership
const getExpirationEmailTemplate = (memberName) => {
    return {
        subject: 'بەسەرچوونی ئەندامێتی - Gym Membership Expired',
        html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #e2e8f0; border-radius: 10px;">
        <h2 style="color: #3b82f6;">بەژدار بووی بەڕێز ${memberName}،</h2>
        <p style="font-size: 16px; line-height: 1.8;">
          بەژداری کردنت لە هۆڵەکەمان کۆتای هات.
        </p>
        <p style="font-size: 16px; line-height: 1.8;">
          تکایە سەردانی بەشی پێشوازی بکە بۆ نوێ کردنەوەی بەژداربوونت.
        </p>
        <br/>
        <p style="font-size: 14px; color: #94a3b8;">لەگەڵ ڕێزدا،</p>
        <p style="font-size: 14px; color: #94a3b8;">تیمی جیم</p>
      </div>
    `,
        text: `
بەژدار بووی بەڕێز ${memberName}،

بەژداری کردنت لە هۆڵەکەمان کۆتای هات.
تکایە سەردانی بەشی پێشوازی بکە بۆ نوێ کردنەوەی بەژداربوونت.

لەگەڵ ڕێزدا،
تیمی جیم
    `,
    };
};

// Send expiration notification email
export const sendExpirationEmail = async (memberEmail, memberName) => {
    if (!memberEmail) {
        console.log(`No email for member: ${memberName}`);
        return { success: false, error: 'No email provided' };
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Email credentials not configured');
        return { success: false, error: 'Email not configured' };
    }

    try {
        const transporter = createTransporter();
        const template = getExpirationEmailTemplate(memberName);

        const info = await transporter.sendMail({
            from: `"Gym System" <${process.env.EMAIL_USER}>`,
            to: memberEmail,
            subject: template.subject,
            text: template.text,
            html: template.html,
        });

        console.log(`Email sent to ${memberEmail}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`Failed to send email to ${memberEmail}:`, error.message);
        return { success: false, error: error.message };
    }
};

export default { sendExpirationEmail };
