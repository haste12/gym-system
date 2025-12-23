import connectDB from '../../../lib/mongodb';
import Member from '../../../lib/models/Member';

export default async function handler(req, res) {
    const { method, query } = req;

    if (method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    await connectDB();

    try {
        const { name } = query;
        if (!name) {
            return res.status(200).json([]);
        }

        const members = await Member.find({
            name: { $regex: name, $options: 'i' },
        });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
