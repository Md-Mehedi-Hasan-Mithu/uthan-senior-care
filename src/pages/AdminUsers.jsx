import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ROLES = ['member', 'employee', 'admin'];

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email: '', full_name: '', role: 'member' });

  useEffect(() => {
    if (!user) return;
    fetchUsers();
  }, [user]);

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const { data, error: queryError } = await supabase
        .from('user_roles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (queryError) throw queryError;
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load user roles.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveUser(ev) {
    ev.preventDefault();
    if (!form.email.trim()) {
      setError('Email is required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const { error: upsertError } = await supabase.from('user_roles').upsert(
        {
          email: form.email.toLowerCase(),
          full_name: form.full_name,
          role: form.role,
        },
        { onConflict: 'email' }
      );

      if (upsertError) throw upsertError;
      setForm({ email: '', full_name: '', role: 'member' });
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Unable to save user role.');
    } finally {
      setSaving(false);
    }
  }

  async function handleRoleChange(email, role) {
    setSaving(true);
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('email', email);
      if (updateError) throw updateError;
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Unable to update role.');
    } finally {
      setSaving(false);
    }
  }

  const visibleUsers = users.filter((item) =>
    `${item.full_name || ''} ${item.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-warm py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[2rem] bg-white border border-gray-200 p-10 shadow-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin user manager</p>
              <h1 className="font-serif text-4xl text-navy font-bold mt-3">Manage user roles</h1>
              <p className="mt-3 max-w-2xl text-gray-600">Create or update role assignments for members and employees. These values inform access and attendance flows across the app.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-8">
              <h2 className="font-semibold text-navy">Add or update a user</h2>
              <form onSubmit={handleSaveUser} className="mt-6 space-y-4">
                <label className="block text-sm text-gray-700">
                  Email
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="staff@example.com"
                  />
                </label>
                <label className="block text-sm text-gray-700">
                  Full name
                  <input
                    value={form.full_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="Jane Doe"
                  />
                </label>
                <label className="block text-sm text-gray-700">
                  Role
                  <select
                    value={form.role}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-white hover:bg-green-dark transition disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save user role'}
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-navy">User roles</h2>
                  <p className="text-sm text-gray-500">Search by email or name, then adjust roles for existing entries.</p>
                </div>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users"
                  className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {loading ? (
                <div className="mt-8 text-center text-gray-500">Loading users…</div>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-600">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Full name</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                        <th className="px-4 py-3 font-semibold text-gray-700">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {visibleUsers.map((item) => (
                        <tr key={item.email} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-navy">{item.email}</td>
                          <td className="px-4 py-3">{item.full_name || '—'}</td>
                          <td className="px-4 py-3">
                            <select
                              value={item.role}
                              onChange={(e) => handleRoleChange(item.email, e.target.value)}
                              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm focus:border-gold focus:ring-2 focus:ring-gold/20"
                              disabled={saving}
                            >
                              {ROLES.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{new Date(item.updated_at).toLocaleString()}</td>
                        </tr>
                      ))}
                      {visibleUsers.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                            No users match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
