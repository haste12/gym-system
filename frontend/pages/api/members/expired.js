import connectDB from '../../../lib/mongodb';
import Member from '../../../lib/models/Member';

export default async function handler(req, res) {
    const { method } = req;

    if (method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    await connectDB();

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiredMembers = await Member.find({
            expirationDate: { $lt: today },
        }).sort({ expirationDate: -1 });

        res.status(200).json(expiredMembers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
