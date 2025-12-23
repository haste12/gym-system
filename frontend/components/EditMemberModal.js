import { useState, useEffect } from 'react';
import { memberAPI } from '../utils/api';
import { calculateExpirationDate, formatDate } from '../utils/dateUtils';

export default function EditMemberModal({ member, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    email: '',
    paymentDate: '',
    months: 1,
    paymentAmount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        age: member.age || '',
        phoneNumber: member.phoneNumber || '',
        email: member.email || '',
        paymentDate: member.paymentDate ? new Date(member.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        months: member.months || 1,
        paymentAmount: member.paymentAmount || '',
      });
    }
  }, [member]);

  if (!member) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSave = async () => {
    setError('');
    setLoading(true);
    try {
      const expirationDate = calculateExpirationDate(new Date(formData.paymentDate), parseInt(formData.months, 10));
      const paymentValue = formData.paymentAmount && formData.paymentAmount !== '' ? parseFloat(formData.paymentAmount) : 0;

      console.log('Edit Payment Debug:', {
        formDataPaymentAmount: formData.paymentAmount,
        parsedValue: paymentValue
      });

      const payload = {
        name: formData.name,
        age: parseInt(formData.age, 10),
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        paymentDate: formData.paymentDate,
        expirationDate: expirationDate.toISOString().split('T')[0],
        months: parseInt(formData.months, 10),
        paymentAmount: paymentValue,
      };

      console.log('Edit payload:', payload);

      await memberAPI.update(member._id, payload);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="mb-4 text-slate-300">
        <div className="text-sm">Edit Member</div>
        <div className="font-semibold text-lg">{member.name}</div>
      </div>

      {error && <div className="mb-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-slate-400">Full Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 glass rounded" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Age</label>
          <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-3 py-2 glass rounded" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Phone Number</label>
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-3 py-2 glass rounded" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Email (Optional)</label>
          <input name="email" type="email" placeholder="member@email.com" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 glass rounded" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Payment Amount</label>
          <input name="paymentAmount" type="number" placeholder="Amount in Iraqi Dinar" value={formData.paymentAmount} onChange={handleChange} min="0" step="1000" className="w-full px-3 py-2 glass rounded" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Payment Date</label>
          <input name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} className="w-full px-3 py-2 glass rounded" />
        </div>
        <div>
          <label className="text-sm text-slate-400">Months</label>
          <select name="months" value={formData.months} onChange={handleChange} className="w-full px-3 py-2 glass rounded">
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <div className="text-sm text-slate-400">Expiration Preview</div>
          <div className="px-3 py-2 bg-slate-800 rounded font-mono">{formatDate(calculateExpirationDate(new Date(formData.paymentDate), parseInt(formData.months, 10)))}</div>
        </div>

        <div className="col-span-1 md:col-span-2 flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 px-4 py-2 bg-slate-700/40 rounded">Cancel</button>
          <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 rounded text-white" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}
