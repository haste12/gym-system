import connectDB from '../../../lib/mongodb';
import Member from '../../../lib/models/Member';

export default async function handler(req, res) {
    const { method } = req;

    await connectDB();

    switch (method) {
        case 'GET':
            try {
                const members = await Member.find().sort({ createdAt: -1 });
                res.status(200).json(members);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;

        case 'POST':
            try {
                const { name, age, phoneNumber, email, paymentDate, expirationDate, months, paymentAmount } = req.body;

                if (!name || !age || !phoneNumber || !paymentDate || !expirationDate) {
                    return res.status(400).json({ message: 'Missing required fields' });
                }

                const member = new Member({
                    name,
                    age,
                    phoneNumber,
                    email: email || '',
                    paymentDate: new Date(paymentDate),
                    expirationDate: new Date(expirationDate),
                    months,
                    paymentAmount: paymentAmount || 0,
                });

                const newMember = await member.save();
                res.status(201).json(newMember);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
