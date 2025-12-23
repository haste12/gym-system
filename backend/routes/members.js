import express from 'express';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
  getExpiredMembers,
} from '../controllers/memberController.js';
import { sendExpirationEmail } from '../services/emailService.js';

const router = express.Router();

router.get('/', getAllMembers);
router.get('/expired/list', getExpiredMembers);
router.get('/search', searchMembers);

// Test email route - for debugging (POST)
router.post('/test-email', async (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  console.log(`Testing email to: ${email}`);
  const result = await sendExpirationEmail(email, name || 'Test User');

  if (result.success) {
    res.json({ message: 'Email sent successfully!', messageId: result.messageId });
  } else {
    res.status(500).json({ message: 'Failed to send email', error: result.error });
  }
});

// Simple GET test route - use in browser: /api/members/send-test-email/your@email.com
router.get('/send-test-email/:email', async (req, res) => {
  const email = req.params.email;
  console.log(`[TEST] Sending test email to: ${email}`);

  const result = await sendExpirationEmail(email, 'Test Member');

  console.log('[TEST] Email result:', result);

  if (result.success) {
    res.json({ success: true, message: 'Email sent!', messageId: result.messageId });
  } else {
    res.json({ success: false, message: 'Failed to send', error: result.error });
  }
});

// Diagnostic endpoint - shows all members with expiration dates for debugging
router.get('/debug-members', async (req, res) => {
  try {
    const Member = (await import('../models/Member.js')).default;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allMembers = await Member.find({}).sort({ expirationDate: -1 });
    const expiredToday = await Member.find({
      expirationDate: {
        $gte: today,
        $lt: tomorrow,
      },
      email: { $exists: true, $ne: '' },
    });

    res.json({
      today: today.toISOString(),
      tomorrow: tomorrow.toISOString(),
      totalMembers: allMembers.length,
      membersExpiringToday: expiredToday.length,
      allMembers: allMembers.map(m => ({
        name: m.name,
        email: m.email || 'NO EMAIL',
        expirationDate: m.expirationDate,
        hasExpired: m.expirationDate < today,
        expiresInDays: Math.ceil((m.expirationDate - today) / (1000 * 60 * 60 * 24))
      })),
      membersExpiringToday: expiredToday.map(m => ({
        name: m.name,
        email: m.email,
        expirationDate: m.expirationDate
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manual trigger for expiration checker - for testing
router.get('/trigger-expiration-check', async (req, res) => {
  console.log('[MANUAL TRIGGER] Running expiration check...');

  try {
    const { runExpirationCheck } = await import('../services/expirationChecker.js');
    await runExpirationCheck();
    res.json({ success: true, message: 'Expiration check completed. Check server logs for details.' });
  } catch (error) {
    console.error('[MANUAL TRIGGER] Error:', error);
    res.status(500).json({ success: false, message: 'Error running expiration check', error: error.message });
  }
});

router.get('/:id', getMemberById);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
