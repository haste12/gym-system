import { useState } from 'react';
import { isExpired, formatDate } from '../utils/dateUtils';
import RenewMemberModal from './RenewMemberModal';
import { memberAPI } from '../utils/api';

export default function ExpiredMembers({ members, onMembersChange }) {
  const expiredMembers = members.filter(member => isExpired(member.expirationDate));
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renewMember, setRenewMember] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  const handleDelete = async (memberId) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      setLoadingDeleteId(memberId);
      await memberAPI.delete(memberId);
      if (onMembersChange) onMembersChange();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete member');
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const handleRenewed = () => {
    if (onMembersChange) onMembersChange();
  };

  if (expiredMembers.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 border-l-4 border-emerald-500 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <h3 className="text-lg font-bold text-slate-100">Expired Members</h3>
        </div>
        <p className="text-emerald-400 text-sm">✓ No expired members - All members are active!</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border-l-4 border-rose-500 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse-soft"></div>
        <h3 className="text-lg font-bold text-slate-100">
          Expired Members <span className="text-rose-400">({expiredMembers.length})</span>
        </h3>
      </div>
      <div className="space-y-3">
        {expiredMembers.map((member, index) => (
          <div
            key={member._id || index}
            className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all duration-300"
            onMouseLeave={() => setOpenMenuId(null)}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name and Status */}
                <div className="md:col-span-2">
                  <p className="font-semibold text-lg text-slate-100 mb-1">{member.name}</p>
                  <p className="text-xs text-slate-400">
                    Expired on: <span className="text-rose-400 font-mono">{formatDate(member.expirationDate)}</span>
                  </p>
                </div>

                {/* Age */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Age</p>
                  <p className="text-sm font-semibold text-slate-200">{member.age} years</p>
                </div>

                {/* Phone Number */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                  <p className="text-sm font-semibold text-rose-400 font-mono">{member.phoneNumber}</p>
                </div>

                {/* Payment Amount */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Payment Amount</p>
                  <p className="text-sm font-semibold text-emerald-400">{(member.paymentAmount || 0).toLocaleString()} IQD</p>
                </div>

                {/* Payment Date */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Payment Date</p>
                  <p className="text-sm font-semibold text-slate-200 font-mono">{formatDate(member.paymentDate)}</p>
                </div>

                {/* Membership Duration */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Membership Duration</p>
                  <p className="text-sm font-semibold text-slate-200">{member.months} {member.months === 1 ? 'Month' : 'Months'}</p>
                </div>
              </div>

              {/* Actions Menu */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setOpenMenuId(openMenuId === member._id ? null : member._id)}
                  className="p-2 rounded hover:bg-slate-700/40"
                  title="Actions"
                >
                  <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {openMenuId === member._id && (
                  <div className="absolute right-0 mt-2 w-40 bg-slate-800 rounded-lg shadow-lg border border-slate-700/40 z-10">
                    <button
                      onClick={() => { setRenewMember(member); setOpenMenuId(null); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-700/30 text-slate-200"
                    >
                      Renew
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="w-full text-left px-4 py-2 hover:bg-rose-600/20 text-rose-300"
                      disabled={loadingDeleteId === member._id}
                    >
                      {loadingDeleteId === member._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Renew Modal */}
      {renewMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setRenewMember(null)}>
          <div className="w-full max-w-2xl glass rounded-2xl p-8 shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">Renew Member</h2>
              <button onClick={() => setRenewMember(null)} className="p-2 hover:bg-slate-700/50 rounded-lg">
                <svg className="w-6 h-6 text-slate-400 hover:text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>
            </div>

            <RenewMemberModal member={renewMember} onClose={() => setRenewMember(null)} onRenewed={handleRenewed} />
          </div>
        </div>
      )}
    </div>
  );
}
