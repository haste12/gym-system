import connectDB from '../../../lib/mongodb';
import { checkExpiredMembers } from '../../../lib/services/expirationChecker';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    await connectDB();

    try {
        console.log('[API] Running expiration check...');
        const result = await checkExpiredMembers();

        if (result.success) {
            res.status(200).json({
                success: true,
                message: 'Expiration check completed',
                totalChecked: result.totalChecked,
                expiredToday: result.expiredToday,
                results: result.results,
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error running expiration check',
                error: result.error,
            });
        }
    } catch (error) {
        console.error('[API] Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}
