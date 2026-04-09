import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiSearch, FiUsers, FiPlus, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ROLE_STYLES = {
  admin: 'bg-violet-100 text-violet-800',
  employee: 'bg-sky-100 text-sky-800',
  member: 'bg-slate-100 text-slate-800',
};

const STATUS_STYLES = {
  Active: 'bg-emerald-100 text-emerald-800',
  Complete: 'bg-slate-100 text-slate-800',
  'No checkout': 'bg-amber-100 text-amber-800',
  Pending: 'bg-orange-100 text-orange-800',
  Disabled: 'bg-red-100 text-red-800',
};

function formatTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatDuration(record) {
  if (!record?.check_in_time) return '—';
  const start = new Date(record.check_in_time);
  const end = record.check_out_time ? new Date(record.check_out_time) : new Date();
  const durationMs = end - start;
  if (durationMs < 0) return '—';
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const mins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}

function getStatus(record, todayDate) {
  if (record.check_out_time) return 'Complete';
  if (record.date < todayDate) return 'No checkout';
  return 'Active';
}

function buildCSV(header, rows) {
  const csv = [header, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  return csv;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('live');
  const [attendance, setAttendance] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', role: 'member', status: 'pending' });
  const [checkoutTime, setCheckoutTime] = useState('');

  const todayDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const startDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  }, []);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!user || !isAdmin) return;
    fetchAttendance();
    fetchAccounts();
  }, [user, isAdmin, fetchAttendance, fetchAccounts]);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: false })
        .limit(1000);
      if (attendanceError) throw attendanceError;
      setAttendance(data || []);
    } catch (err) {
      setError(err.message || 'Unable to fetch attendance.');
    } finally {
      setLoading(false);
    }
  }, [startDate]);

  const fetchAccounts = useCallback(async () => {
    try {
      const { data, error: accountError } = await supabase
        .from('user_roles')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(500);
      if (accountError) throw accountError;
      setAccounts(data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const liveRecords = attendance.filter((record) => record.date === todayDate && !record.check_out_time);
  const todayRecords = attendance.filter((record) => record.date === todayDate);
  const weekRecords = attendance;
  const reviewRecords = attendance.filter((record) => !record.check_out_time && record.date < todayDate);
  const filteredTodayRecords = todayRecords.filter((record) => record.user_name.toLowerCase().includes(search.toLowerCase()));
  const filteredWeekRecords = weekRecords.filter((record) => {
    const matchesName = record.user_name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? record.role === roleFilter : true;
    return matchesName && matchesRole;
  });
  const filteredAccounts = accounts.filter((account) => {
    const matchesText = `${account.full_name} ${account.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? account.role === roleFilter : true;
    const matchesStatus = statusFilter ? account.status === statusFilter : true;
    return matchesText && matchesRole && matchesStatus;
  });

  const headerRecords = activeTab === 'live' ? liveRecords : activeTab === 'today' ? filteredTodayRecords : activeTab === 'week' ? filteredWeekRecords : [];

  function closeModal() {
    setModal(null);
    setCheckoutTime('');
  }

  function openConfirmModal(title, message, onConfirm) {
    setModal({ type: 'confirm', title, message, onConfirm });
  }

  async function forceCheckout(record) {
    openConfirmModal('Force check-out', `Force check out ${record.user_name} now?`, async () => {
      try {
        const now = new Date().toISOString();
        const { error } = await supabase.from('attendance').update({ check_out_time: now }).eq('id', record.id);
        if (error) throw error;
        await fetchAttendance();
      } catch (err) {
        setError(err.message || 'Unable to force check out.');
      } finally {
        closeModal();
      }
    });
  }

  async function updateAccountRole(account, nextRole) {
    try {
      const { error } = await supabase.from('user_roles').update({ role: nextRole }).eq('id', account.id);
      if (error) throw error;
      setAccounts((current) => current.map((item) => (item.id === account.id ? { ...item, role: nextRole } : item)));
    } catch (err) {
      setError(err.message || 'Unable to update role.');
    }
  }

  async function updateAccountStatus(account, nextStatus) {
    try {
      const { error } = await supabase.from('user_roles').update({ status: nextStatus }).eq('id', account.id);
      if (error) throw error;
      setAccounts((current) => current.map((item) => (item.id === account.id ? { ...item, status: nextStatus } : item)));
    } catch (err) {
      setError(err.message || 'Unable to update status.');
    }
  }

  async function handleAddUser() {
    try {
      const { error } = await supabase.from('user_roles').insert([newUser]);
      if (error) throw error;
      setAccounts((current) => [newUser, ...current]);
      setNewUser({ full_name: '', email: '', role: 'member', status: 'pending' });
      closeModal();
    } catch (err) {
      setError(err.message || 'Unable to add user.');
    }
  }

  function openDisableModal(account) {
    openConfirmModal('Disable account', `Disable ${account.full_name}?`, async () => {
      await updateAccountStatus(account, 'disabled');
      closeModal();
    });
  }

  function openApproveModal(account) {
    openConfirmModal('Approve account', `Approve ${account.full_name} as active?`, async () => {
      await updateAccountStatus(account, 'active');
      closeModal();
    });
  }

  function openRejectModal(account) {
    openConfirmModal('Reject account', `Reject ${account.full_name} and mark as disabled?`, async () => {
      await updateAccountStatus(account, 'disabled');
      closeModal();
    });
  }

  function openCheckoutTimeModal(record) {
    setCheckoutTime(new Date().toISOString().slice(0, 16));
    setModal({ type: 'checkout', record });
  }

  async function handleSetCheckoutTime() {
    if (!modal?.record) return;
    try {
      const now = new Date(checkoutTime).toISOString();
      const { error } = await supabase.from('attendance').update({ check_out_time: now }).eq('id', modal.record.id);
      if (error) throw error;
      await fetchAttendance();
      closeModal();
    } catch (err) {
      setError(err.message || 'Unable to set checkout time.');
    }
  }

  function downloadCSV() {
    const header = ['Name', 'Role', 'Date', 'Check In', 'Check Out', 'Duration', 'Status'];
    const rows = headerRecords.map((record) => [
      record.user_name,
      record.role,
      record.date,
      formatTime(record.check_in_time),
      formatTime(record.check_out_time),
      formatDuration(record),
      getStatus(record, todayDate),
    ]);
    const csv = buildCSV(header, rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `admin-${activeTab}-${todayDate}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!isAdmin) {
    return (
      <section className="min-h-screen bg-warm py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Access denied</p>
            <h1 className="font-serif text-4xl text-navy font-bold mt-3">Admin access required</h1>
            <p className="mt-4 text-gray-600">Only administrators can view this dashboard.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-warm py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin dashboard</p>
              <h1 className="font-serif text-4xl text-navy font-bold mt-3">Uthan attendance control</h1>
              <p className="mt-3 text-gray-600">Monitor live presence, manage attendance, and approve accounts from one place.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-3xl bg-gray-50 p-5 border border-gray-200">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Live now</p>
                <p className="mt-3 text-3xl font-semibold text-navy">{liveRecords.length}</p>
              </div>
              <div className="rounded-3xl bg-gray-50 p-5 border border-gray-200">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Total staff</p>
                <p className="mt-3 text-3xl font-semibold text-navy">{accounts.length}</p>
              </div>
              <div className="rounded-3xl bg-gray-50 p-5 border border-gray-200">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Today's records</p>
                <p className="mt-3 text-3xl font-semibold text-navy">{todayRecords.length}</p>
              </div>
              <div className="rounded-3xl bg-gray-50 p-5 border border-gray-200">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Pending review</p>
                <p className="mt-3 text-3xl font-semibold text-navy">{reviewRecords.length}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-center gap-2">
                <FiAlertCircle className="text-red-500" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {['live', 'today', 'week', 'accounts', 'review'].map((tab) => {
                const label =
                  tab === 'live'
                    ? 'Live presence'
                    : tab === 'today'
                    ? 'Today'
                    : tab === 'week'
                    ? 'Past 7 days'
                    : tab === 'accounts'
                    ? 'Account management'
                    : 'Needs review';
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      activeTab === tab ? 'bg-gold text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={downloadCSV}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white hover:bg-green-dark transition"
            >
              <FiExternalLink size={18} />
              Export CSV
            </button>
          </div>
        </motion.div>

        {activeTab === 'live' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiCheckCircle className="text-gold" size={24} />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Live presence</p>
                <h2 className="font-serif text-2xl text-navy font-bold">Currently checked in</h2>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading…</div>
            ) : liveRecords.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-gray-500">No active check-ins right now.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-4 font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-4 font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-4 font-semibold text-gray-700">Check-in</th>
                      <th className="px-4 py-4 font-semibold text-gray-700">Duration</th>
                      <th className="px-4 py-4 font-semibold text-gray-700">Location</th>
                      <th className="px-4 py-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {liveRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-medium text-navy">{record.user_name}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${ROLE_STYLES[record.role] || ROLE_STYLES.member}`}>{record.role}</span>
                        </td>
                        <td className="px-4 py-4">{formatTime(record.check_in_time)}</td>
                        <td className="px-4 py-4">{formatDuration(record)}</td>
                        <td className="px-4 py-4 text-gray-500">{record.location}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => forceCheckout(record)}
                            className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
                          >
                            Force check-out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'today' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-lg"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Today</p>
                <h2 className="font-serif text-2xl text-navy font-bold">Today's attendance</h2>
              </div>
              <div className="w-full max-w-md">
                <label className="sr-only">Search by name</label>
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name"
                    className="w-full rounded-full border border-gray-200 bg-white px-12 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Role</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Check-in</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Check-out</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Duration</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">Loading…</td>
                    </tr>
                  ) : filteredTodayRecords.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No attendance records found for today.</td>
                    </tr>
                  ) : (
                    filteredTodayRecords.map((record) => {
                      const statusLabel = getStatus(record, todayDate);
                      return (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 font-medium text-navy">{record.user_name}</td>
                          <td className="px-4 py-4 capitalize">{record.role}</td>
                          <td className="px-4 py-4">{formatTime(record.check_in_time)}</td>
                          <td className="px-4 py-4">{formatTime(record.check_out_time)}</td>
                          <td className="px-4 py-4">{formatDuration(record)}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[statusLabel]}`}>{statusLabel}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'week' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-lg"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Past 7 days</p>
                <h2 className="font-serif text-2xl text-navy font-bold">Attendance history</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name"
                    className="w-full rounded-full border border-gray-200 bg-white px-12 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                >
                  <option value="">All roles</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Role</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Check in</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Check out</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Duration</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">Loading…</td>
                    </tr>
                  ) : filteredWeekRecords.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">No records match your filters.</td>
                    </tr>
                  ) : (
                    filteredWeekRecords.map((record) => {
                      const statusLabel = getStatus(record, todayDate);
                      return (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 font-medium text-navy">{record.user_name}</td>
                          <td className="px-4 py-4 capitalize">{record.role}</td>
                          <td className="px-4 py-4">{record.date}</td>
                          <td className="px-4 py-4">{formatTime(record.check_in_time)}</td>
                          <td className="px-4 py-4">{formatTime(record.check_out_time)}</td>
                          <td className="px-4 py-4">{formatDuration(record)}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[statusLabel]}`}>{statusLabel}</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'accounts' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-lg"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Account management</p>
                <h2 className="font-serif text-2xl text-navy font-bold">Manage user accounts</h2>
              </div>
              <button
                onClick={() => setModal({ type: 'addUser' })}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white hover:bg-green-dark transition"
              >
                <FiPlus size={18} />
                Add user
              </button>
            </div>

            <div className="grid gap-3 lg:grid-cols-3 mb-6">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Search</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name or email"
                  className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="member">Member</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Role</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Last active</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No accounts available.</td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-medium text-navy">{account.full_name}</td>
                        <td className="px-4 py-4 text-gray-700">{account.email}</td>
                        <td className="px-4 py-4">
                          <select
                            value={account.role}
                            onChange={(e) => updateAccountRole(account, e.target.value)}
                            className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                          >
                            <option value="admin">Admin</option>
                            <option value="employee">Employee</option>
                            <option value="member">Member</option>
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[account.status === 'active' ? 'Active' : account.status === 'pending' ? 'Pending' : 'Disabled']}`}>
                            {account.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-500">{account.updated_at ? new Date(account.updated_at).toLocaleDateString() : '—'}</td>
                        <td className="px-4 py-4 space-x-2">
                          {account.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => openApproveModal(account)}
                                className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(account)}
                                className="rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 hover:bg-orange-100 transition"
                              >
                                Reject
                              </button>
                            </>
                          ) : account.status === 'active' ? (
                            <button
                              onClick={() => openDisableModal(account)}
                              className="rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                            >
                              Disable
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
            </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'review' && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-lg"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Needs review</p>
                <h2 className="font-serif text-2xl text-navy font-bold">Attendance fixes</h2>
              </div>
              <p className="text-sm text-gray-500">Records without checkout on a past date.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-4 font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Check in</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Duration</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviewRecords.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No records require review.</td>
                    </tr>
                  ) : (
                    reviewRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-medium text-navy">{record.user_name}</td>
                        <td className="px-4 py-4">{record.date}</td>
                        <td className="px-4 py-4">{formatTime(record.check_in_time)}</td>
                        <td className="px-4 py-4">{formatDuration(record)}</td>
                        <td className="px-4 py-4 text-gray-500">{record.location}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => openCheckoutTimeModal(record)}
                            className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white hover:bg-green-dark transition"
                          >
                            Set checkout time
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl"
          >
            {modal.type === 'confirm' && (
              <>
                <h3 className="text-2xl font-semibold text-navy">{modal.title}</h3>
                <p className="mt-4 text-gray-600">{modal.message}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={modal.onConfirm}
                    className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white hover:bg-green-dark transition"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}

            {modal.type === 'addUser' && (
              <>
                <div className="flex items-center gap-3">
                  <FiPlus className="text-gold" size={24} />
                  <div>
                    <h3 className="text-2xl font-semibold text-navy">Add user</h3>
                    <p className="mt-2 text-gray-600">Create a new staff or member record in user management.</p>
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Full name</label>
                    <input
                      type="text"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, full_name: e.target.value }))}
                      className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                      className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="admin">Admin</option>
                      <option value="employee">Employee</option>
                      <option value="member">Member</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <select
                      value={newUser.status}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, status: e.target.value }))}
                      className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white hover:bg-green-dark transition"
                  >
                    Create user
                  </button>
                </div>
              </>
            )}

            {modal.type === 'checkout' && (
              <>
                <div className="flex items-center gap-3">
                  <FiClock className="text-gold" size={24} />
                  <div>
                    <h3 className="text-2xl font-semibold text-navy">Set checkout time</h3>
                    <p className="mt-2 text-gray-600">Set a fixed checkout time for {modal.record?.user_name}.</p>
                  </div>
                </div>
                <div className="mt-8">
                  <label className="text-sm font-semibold text-gray-700">Checkout timestamp</label>
                  <input
                    type="datetime-local"
                    value={checkoutTime}
                    onChange={(e) => setCheckoutTime(e.target.value)}
                    className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSetCheckoutTime}
                    className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white hover:bg-green-dark transition"
                  >
                    Save checkout
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </section>
  );
}
