import { useState } from 'react';
import { memberAPI } from '../utils/api';
import { calculateExpirationDate, formatDate } from '../utils/dateUtils';

export default function AddMemberForm({ onMemberAdded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    email: '',
    paymentDate: new Date().toISOString().split('T')[0],
    months: 1,
    paymentAmount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const expirationDate = calculateExpirationDate(
        new Date(formData.paymentDate),
        parseInt(formData.months)
      );

      const paymentValue = formData.paymentAmount && formData.paymentAmount !== '' ? parseFloat(formData.paymentAmount) : 0;

      console.log('Payment Debug:', {
        formDataPaymentAmount: formData.paymentAmount,
        parsedValue: paymentValue,
        type: typeof paymentValue
      });

      const memberData = {
        name: formData.name,
        age: parseInt(formData.age),
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        paymentDate: formData.paymentDate,
        months: parseInt(formData.months),
        paymentAmount: paymentValue,
        expirationDate: expirationDate.toISOString().split('T')[0],
      };

      console.log('Member Data being sent:', memberData);

      await memberAPI.create(memberData);

      setSuccess(`✓ Member ${formData.name} added successfully!`);

      setFormData({
        name: '',
        age: '',
        phoneNumber: '',
        email: '',
        paymentDate: new Date().toISOString().split('T')[0],
        months: 1,
        paymentAmount: '',
      });

      setTimeout(() => setSuccess(''), 3000);

      if (onMemberAdded) {
        onMemberAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 mb-8 animate-slide-in-left">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold gradient-text">Add New Member</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter member name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 glass text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 glass text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Email (Optional)</label>
            <input
              type="email"
              name="email"
              placeholder="member@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 glass text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Iraqi phone (e.g., +964...)"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 glass text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Payment Amount</label>
            <input
              type="number"
              name="paymentAmount"
              placeholder="Amount in Iraqi Dinar"
              value={formData.paymentAmount}
              onChange={handleChange}
              min="0"
              step="1000"
              className="w-full px-4 py-3 glass text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 glass text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Membership Duration</label>
            <select
              name="months"
              value={formData.months}
              onChange={handleChange}
              className="w-full px-4 py-3 glass text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="1" className="bg-slate-900">1 Month</option>
              <option value="3" className="bg-slate-900">3 Months</option>
              <option value="6" className="bg-slate-900">6 Months</option>
              <option value="12" className="bg-slate-900">1 Year</option>
            </select>
          </div>
          {formData.paymentDate && formData.months && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Auto Expiration</label>
              <div className="w-full px-4 py-3 glass text-blue-400 rounded-xl font-mono text-sm flex items-center">
                {formatDate(calculateExpirationDate(new Date(formData.paymentDate), parseInt(formData.months)))}
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Adding Member...
            </div>
          ) : (
            'Add Member'
          )}
        </button>
      </form>
    </div>
  );
}
