import Member from '../models/Member.js';
import { sendExpirationEmail } from './emailService.js';

// Check for expired members and send notifications
export const checkExpiredMembers = async () => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        console.log(`[EXPIRATION CHECK] Checking for members with expiration date between ${today.toISOString()} and ${tomorrow.toISOString()}`);

        // Find all members with email addresses
        const allMembers = await Member.find({
            email: { $exists: true, $ne: '' },
        });

        console.log(`[EXPIRATION CHECK] Total members with email: ${allMembers.length}`);

        // Filter members whose expiration date (date part only) matches today
        const expiredToday = allMembers.filter(member => {
            const expDate = new Date(member.expirationDate);
            const expDateOnly = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate());
            return expDateOnly.getTime() === today.getTime();
        });

        console.log(`[EXPIRATION CHECK] Found ${expiredToday.length} members who expired today`);

        const results = [];
        for (const member of expiredToday) {
            if (member.email) {
                console.log(`[EXPIRATION CHECK] Sending email to: ${member.name} (${member.email}) - Expired: ${member.expirationDate}`);
                const result = await sendExpirationEmail(member.email, member.name);
                results.push({
                    member: member.name,
                    email: member.email,
                    success: result.success,
                    error: result.error,
                });
                if (result.success) {
                    console.log(`[EXPIRATION CHECK] ✓ Email sent successfully to ${member.email}`);
                } else {
                    console.error(`[EXPIRATION CHECK] ✗ Failed to send email to ${member.email}:`, result.error);
                }
            }
        }

        return {
            success: true,
            totalChecked: allMembers.length,
            expiredToday: expiredToday.length,
            results,
        };
    } catch (error) {
        console.error('Error checking expired members:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};

export default { checkExpiredMembers };
