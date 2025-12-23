import Member from '../models/Member.js';

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMember = async (req, res) => {
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

  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
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
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchMembers = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.json([]);
    }

    const members = await Member.find({
      name: { $regex: name, $options: 'i' },
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpiredMembers = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredMembers = await Member.find({
      expirationDate: { $lt: today },
    }).sort({ expirationDate: -1 });

    res.json(expiredMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
