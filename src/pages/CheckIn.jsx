import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const LOCATION_LABEL = 'Uthan Senior Care — Deer Park Avenue';

function formatTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

function formatDay(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date(value));
}

function durationText(record) {
  if (!record?.check_in_time) return '—';
  const start = new Date(record.check_in_time);
  const end = record.check_out_time ? new Date(record.check_out_time) : new Date();
  const durationMs = end - start;
  if (durationMs < 0) return '—';
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const mins = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}

function statusPill(record, todayDate) {
  if (!record) return { label: 'No checkout', color: 'bg-yellow-100 text-yellow-800' };
  if (record.check_out_time) return { label: 'Complete', color: 'bg-slate-100 text-slate-800' };
  if (record.date < todayDate) return { label: 'No checkout', color: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Active', color: 'bg-emerald-100 text-emerald-800' };
}

export default function CheckIn() {
  const { user } = useAuth();
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const today = useMemo(() => new Date(), []);
  const todayDate = useMemo(() => today.toISOString().slice(0, 10), [today]);
  const displayDate = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(today),
    [today]
  );

  const firstName = user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Team member';
  const role = user?.role || 'member';
  const isAdmin = role === 'admin';
  const isCheckedIn = Boolean(todayRecord && !todayRecord.check_out_time);
  const hasCheckedIn = Boolean(todayRecord);

  useEffect(() => {
    if (!user) return;

    async function loadAttendance() {
      setLoading(true);
      setError('');
      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        const startDateString = startDate.toISOString().slice(0, 10);

        const [{ data: todayData, error: todayError }, { data: historyData, error: historyError }] = await Promise.all([
          supabase
            .from('attendance')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', todayDate)
            .order('check_in_time', { ascending: false })
            .limit(1),
          supabase
            .from('attendance')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDateString)
            .order('date', { ascending: false }),
        ]);

        if (todayError) throw todayError;
        if (historyError) throw historyError;

        setTodayRecord(todayData?.[0] ?? null);
        setHistory(historyData || []);
      } catch (err) {
        setError(err.message || 'Unable to load attendance.');
      } finally {
        setLoading(false);
      }
    }

    loadAttendance();
  }, [user, todayDate]);

  async function refreshAttendance() {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const startDateString = startDate.toISOString().slice(0, 10);

      const [{ data: todayData, error: todayError }, { data: historyData, error: historyError }] = await Promise.all([
        supabase
          .from('attendance')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', todayDate)
          .order('check_in_time', { ascending: false })
          .limit(1),
        supabase
          .from('attendance')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', startDateString)
          .order('date', { ascending: false }),
      ]);

      if (todayError) throw todayError;
      if (historyError) throw historyError;

      setTodayRecord(todayData?.[0] ?? null);
      setHistory(historyData || []);
    } catch (err) {
      setError(err.message || 'Unable to refresh attendance.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn() {
    setStatus('loading');
    setError('');
    setMessage('');
    try {
      const now = new Date().toISOString();
      const { error: insertError } = await supabase.from('attendance').insert([
        {
          user_id: user.id,
          user_name: user.fullName || user.email,
          role,
          date: todayDate,
          location: LOCATION_LABEL,
          check_in_time: now,
        },
      ]);
      if (insertError) throw insertError;
      setMessage('Checked in successfully.');
      await refreshAttendance();
    } catch (err) {
      setError(err.message || 'Unable to check in.');
    } finally {
      setStatus('idle');
    }
  }

  async function handleCheckOut() {
    if (!todayRecord?.id) return;
    setStatus('loading');
    setError('');
    setMessage('');
    try {
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('attendance')
        .update({ check_out_time: now })
        .eq('id', todayRecord.id);
      if (updateError) throw updateError;
      setMessage('Checked out successfully.');
      await refreshAttendance();
    } catch (err) {
      setError(err.message || 'Unable to check out.');
    } finally {
      setStatus('idle');
    }
  }

  return (
    <section className="min-h-screen bg-warm py-20 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-lg"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Attendance check-in</p>
              <h1 className="font-serif text-4xl text-navy font-bold mt-3">Welcome back, {firstName}.</h1>
              <p className="mt-3 text-gray-600">Today is {displayDate}. Your role is: {user?.role ?? 'unknown'}.</p>
              {isAdmin && (
                <div className="mt-4">
                  <a
                    href="/admin"
                    className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition"
                  >
                    Go to Admin Dashboard →
                  </a>
                </div>
              )}
            </div>
            <div className="rounded-full border border-gray-200 bg-warm px-5 py-3 text-sm font-semibold text-navy shadow-sm">
              {LOCATION_LABEL}
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] bg-gray-50 p-8 shadow-lg border border-gray-200">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Today's status</p>
              <div className="mt-4 flex items-center gap-3">
                {isCheckedIn ? <FiCheckCircle className="text-emerald-500" size={24} /> : <FiXCircle className="text-yellow-500" size={24} />}
                <p className="text-3xl font-semibold text-navy">{isCheckedIn ? 'Checked In' : 'Not checked in'}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">{hasCheckedIn ? 'Your current attendance is active for today.' : 'Tap the button to start your shift.'}</p>
            </div>
            <div className="rounded-[2rem] bg-gray-50 p-8 shadow-lg border border-gray-200">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Today</p>
              <p className="mt-4 text-3xl font-semibold text-navy">{displayDate}</p>
              <p className="mt-2 text-sm text-gray-600">This card tracks your current attendance status and recent history.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-lg">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gold">Action</p>
                  <h2 className="font-serif text-3xl text-navy font-bold mt-3">Check in / out</h2>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleCheckIn}
                    disabled={status === 'loading' || isCheckedIn}
                    className="rounded-full bg-gold px-8 py-4 text-sm font-semibold text-white transition hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Saving…' : 'Check In'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckOut}
                    disabled={status === 'loading' || !isCheckedIn}
                    className="rounded-full border border-navy bg-white px-8 py-4 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Saving…' : 'Check Out'}
                  </button>
                </div>
              </div>

              {(message || error) && (
                <div className={`mt-6 rounded-3xl px-5 py-4 text-sm ${error ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'}`}>
                  {error || message}
                </div>
              )}

              <div className="mt-10 overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-600">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 font-semibold text-navy">Date</th>
                      <th className="py-4 font-semibold text-navy">Day</th>
                      <th className="py-4 font-semibold text-navy">Check in</th>
                      <th className="py-4 font-semibold text-navy">Check out</th>
                      <th className="py-4 font-semibold text-navy">Duration</th>
                      <th className="py-4 font-semibold text-navy">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">Loading history…</td>
                      </tr>
                    ) : history.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">No attendance records in the last 7 days.</td>
                      </tr>
                    ) : (
                      history.map((record) => {
                        const pill = statusPill(record, todayDate);
                        return (
                          <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 font-medium text-navy">{record.date}</td>
                            <td className="py-4">{formatDay(record.date)}</td>
                            <td className="py-4">{formatTime(record.check_in_time)}</td>
                            <td className="py-4">{formatTime(record.check_out_time)}</td>
                            <td className="py-4">{durationText(record)}</td>
                            <td className="py-4">
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${pill.color}`}>{pill.label}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div className="rounded-[2rem] bg-white border border-gray-200 p-8 shadow-lg">
                <div className="flex items-center gap-3">
                  <FiClock className="text-gold" size={22} />
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gold">Live session</p>
                    <h2 className="font-serif text-2xl text-navy font-bold mt-2">Current shift</h2>
                  </div>
                </div>
                <div className="mt-6 rounded-[1.5rem] bg-warm p-6 text-sm text-gray-700">
                  <p className="font-semibold text-navy">Elapsed time</p>
                  <p className="mt-3 text-3xl font-semibold text-navy">{isCheckedIn ? durationText(todayRecord) : '00h 00m'}</p>
                  <p className="mt-2 text-gray-600">{isCheckedIn ? 'Since your latest check-in.' : 'Start your shift to begin timing.'}</p>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white border border-gray-200 p-8 shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Shift status</p>
                <h2 className="font-serif text-2xl text-navy font-bold mt-2">{isCheckedIn ? 'In session' : 'Awaiting check-in'}</h2>
                <p className="mt-4 text-gray-600">{isCheckedIn ? 'You are currently checked in and the timer is active.' : 'No active check-in detected for today.'}</p>
              </div>

              <div className="rounded-[2rem] bg-white border border-gray-200 p-8 shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-gold">How it works</p>
                <ul className="mt-6 space-y-4 text-gray-600">
                  <li className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold" />
                    Check in once at arrival and check out at the end of your shift.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold" />
                    The app tracks elapsed time live while you remain checked in.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold" />
                    Your seven-day history is available for review with duration and status.
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
