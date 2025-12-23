import connectDB from '../../../lib/mongodb';
import Member from '../../../lib/models/Member';

export default async function handler(req, res) {
    const { method, query } = req;
    const { id } = query;

    await connectDB();

    switch (method) {
        case 'GET':
            try {
                const member = await Member.findById(id);
                if (!member) {
                    return res.status(404).json({ message: 'Member not found' });
                }
                res.status(200).json(member);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;

        case 'PUT':
            try {
                const member = await Member.findById(id);
                if (!member) {
                    return res.status(404).json({ message: 'Member not found' });
                }

                if (req.body.name) member.name = req.body.name;
                if (req.body.age) member.age = req.body.age;
                if (req.body.phoneNumber) member.phoneNumber = req.body.phoneNumber;
                if (req.body.email !== undefined) member.email = req.body.email;
                if (req.body.paymentDate) member.paymentDate = new Date(req.body.paymentDate);
                if (req.body.expirationDate) member.expirationDate = new Date(req.body.expirationDate);
                if (req.body.months) member.months = req.body.months;
                if (req.body.paymentAmount !== undefined) member.paymentAmount = req.body.paymentAmount;

                const updatedMember = await member.save();
                res.status(200).json(updatedMember);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
            break;

        case 'DELETE':
            try {
                const member = await Member.findById(id);
                if (!member) {
                    return res.status(404).json({ message: 'Member not found' });
                }

                await Member.findByIdAndDelete(id);
                res.status(200).json({ message: 'Member deleted' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
