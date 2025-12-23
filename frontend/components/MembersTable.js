import { useState } from 'react';
import { isExpired, formatDate, daysUntilExpiration } from '../utils/dateUtils';
import EditMemberModal from './EditMemberModal';
import { memberAPI } from '../utils/api';

export default function MembersTable({ members, onMembersChange }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  if (!members || members.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center animate-fade-in">
        <svg className="w-16 h-16 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m0 0h6M6 12a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <p className="text-slate-400 text-lg">No members found</p>
      </div>
    );
  }

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

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden animate-fade-in shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-slate-700/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-400">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-400">Age</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-400">Phone Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-400">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-400">Payment Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-400">Expiration Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-blue-400"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => {
                const expired = isExpired(member.expirationDate);
                const daysLeft = daysUntilExpiration(member.expirationDate);

                return (
                  <tr
                    key={member._id || index}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors duration-300"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-slate-100">{member.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{member.age}</td>
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{member.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-emerald-400 font-semibold">{(member.paymentAmount || 0).toLocaleString()} IQD</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{formatDate(member.paymentDate)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{formatDate(member.expirationDate)}</td>
                    <td className="px-6 py-4 text-sm">
                      {expired ? (
                        <span className="badge-expired inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold">
                          <span className="w-2 h-2 bg-rose-400 rounded-full"></span>
                          Expired
                        </span>
                      ) : daysLeft <= 7 ? (
                        <span className="badge-expiring inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold">
                          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse-soft"></span>
                          Expiring in {daysLeft}d
                        </span>
                      ) : (
                        <span className="badge-active inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="relative">
                        <button onClick={() => setOpenMenuId(openMenuId === member._id ? null : member._id)} className="p-2 rounded hover:bg-slate-700/40">
                          <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openMenuId === member._id && (
                          <div className="absolute right-0 mt-2 w-36 bg-slate-800 rounded-lg shadow-lg border border-slate-700/40 z-10">
                            <button onClick={() => { setEditMember(member); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-700/30 text-slate-200">Edit</button>
                            <button onClick={() => handleDelete(member._id)} className="w-full text-left px-4 py-2 hover:bg-rose-600/20 text-rose-300">{loadingDeleteId === member._id ? 'Deleting...' : 'Delete'}</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal - Rendered outside table container */}
      {editMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 pt-12" onClick={() => setEditMember(null)}>
          <div className="w-full max-w-2xl glass rounded-2xl p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold gradient-text">Edit Member</h2>
              <button onClick={() => setEditMember(null)} className="p-2 hover:bg-slate-700/50 rounded-lg">
                <svg className="w-6 h-6 text-slate-400 hover:text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                </svg>
              </button>
            </div>

            <EditMemberModal member={editMember} onClose={() => setEditMember(null)} onSaved={onMembersChange} />
          </div>
        </div>
      )}
    </>
  );
}
