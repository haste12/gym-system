import { useEffect, useState } from 'react';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import MembersTable from '../components/MembersTable';
import ExpiredMembers from '../components/ExpiredMembers';
import AddMemberForm from '../components/AddMemberForm';
import ThemeSelector from '../components/ThemeSelector';
import { memberAPI } from '../utils/api';
import { useAuth } from '../utils/useAuth';

export default function Home() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { isAuthenticated, isLoading: authLoading, requireAuth, logout } = useAuth();

  // Update clock and date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      const dateStr = now.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      setTime(timeStr);
      setDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check authentication
  useEffect(() => {
    requireAuth();
  }, [isAuthenticated, authLoading]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await memberAPI.getAll();
      setMembers(response.data);
      setFilteredMembers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  };

  const handleMemberAdded = () => {
    setShowAddModal(false);
    fetchMembers();
  };

  const expiredCount = members.filter(m => {
    const expDate = new Date(m.expirationDate);
    expDate.setHours(0, 0, 0, 0);
    return expDate < new Date();
  }).length;

  // Don't render until auth check is complete
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gym Management System</title>
        <meta name="description" content="Professional Gym Member Management System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen">
        {/* Header */}
        <header className="border-b border-slate-700/50 glass sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="animate-slide-in-left flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8zm0 18c-3.35 0-6-2.57-6-6.1 0-2.31 1.64-4.74 6-8.88 4.36 4.14 6 6.57 6 8.88 0 3.53-2.65 6.1-6 6.1z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Gym System</h1>
                  <p className="text-xs text-slate-400">Member Management Platform</p>
                </div>
              </div>
              <div className="text-right animate-slide-in-right space-y-2">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-mono font-bold text-blue-400">{time}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{date}</div>
                  </div>
                  <div className="w-px h-12 bg-slate-700/30"></div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Total Members</div>
                    <div className="text-3xl font-bold gradient-text">{members.length}</div>
                  </div>
                  <div className="w-px h-12 bg-slate-700/30"></div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-rose-500/20 border border-slate-700/50 hover:border-rose-500/50 rounded-lg transition-all duration-300 group"
                    title="Logout"
                  >
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm text-slate-400 group-hover:text-rose-400 transition-colors">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Modal Backdrop */}
        {showAddModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="w-full max-w-2xl glass rounded-2xl p-8 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold gradient-text">Add New Member</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-400 hover:text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>
              <AddMemberForm onMemberAdded={handleMemberAdded} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 flex items-start gap-3 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Theme Selector */}
          <ThemeSelector />

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass rounded-2xl p-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Active Members</p>
                  <p className="text-3xl font-bold text-emerald-400">{members.length - expiredCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Expired</p>
                  <p className="text-3xl font-bold text-rose-400">{expiredCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Showing</p>
                  <p className="text-3xl font-bold text-blue-400">{filteredMembers.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Members Table Section */}
          <div className="mb-8">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                All Members
              </h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Member
              </button>
            </div>
            {loading ? (
              <div className="glass rounded-2xl p-12 flex justify-center items-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading members...</p>
                </div>
              </div>
            ) : (
              <MembersTable members={filteredMembers} onMembersChange={fetchMembers} />
            )}
          </div>

          {/* Expired Members Section */}
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-rose-600 to-amber-600 rounded-full"></span>
                Membership Status
              </h2>
            </div>
            <ExpiredMembers members={members} onMembersChange={fetchMembers} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-slate-400 text-sm">
              © 2025 Gym Management System. Professional Member Management Platform.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
