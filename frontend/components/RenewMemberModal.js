import { useState } from 'react';
import { memberAPI } from '../utils/api';
import { calculateExpirationDate, formatDate } from '../utils/dateUtils';

export default function RenewMemberModal({ member, onClose, onRenewed }) {
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!member) return null;

  const handleRenew = async () => {
    setError('');
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const currentExp = new Date(member.expirationDate);
      currentExp.setHours(0, 0, 0, 0);

      // If member is already active (exp in future), extend from current expiration.
      // If already expired, start from today.
      const baseDate = currentExp > today ? currentExp : today;
      const newExp = calculateExpirationDate(baseDate, parseInt(months, 10));

      const payload = {
        paymentDate: today.toISOString().split('T')[0],
        expirationDate: newExp.toISOString().split('T')[0],
        months: parseInt(months, 10),
      };

      await memberAPI.update(member._id, payload);
      if (onRenewed) onRenewed();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to renew member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4 text-slate-300">
        <div className="text-sm">Renewing</div>
        <div className="font-semibold text-lg">{member.name}</div>
        <div className="text-xs text-slate-400">Current expiration: <span className="font-mono">{formatDate(member.expirationDate)}</span></div>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm text-slate-400">Extend by</label>
        <select
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          className="w-full px-3 py-2 glass text-white rounded-lg"
        >
          <option value={1}>1 Month</option>
          <option value={3}>3 Months</option>
          <option value={6}>6 Months</option>
          <option value={12}>12 Months</option>
        </select>

        <div className="text-sm text-slate-400">New expiration preview:</div>
        <div className="px-3 py-2 bg-slate-800 rounded text-slate-200 font-mono">{formatDate(calculateExpirationDate(new Date(member.expirationDate) > new Date() ? new Date(member.expirationDate) : new Date(), parseInt(months, 10)))}</div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700/40 text-slate-200 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleRenew}
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? 'Renewing...' : 'Renew'}
          </button>
        </div>
      </div>
    </div>
  );
}
