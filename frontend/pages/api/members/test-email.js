import { sendExpirationEmail } from '../../../lib/services/emailService';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        console.log(`Testing email to: ${email}`);
        const result = await sendExpirationEmail(email, name || 'Test User');

        if (result.success) {
            res.status(200).json({ message: 'Email sent successfully!', messageId: result.messageId });
        } else {
            res.status(500).json({ message: 'Failed to send email', error: result.error });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
