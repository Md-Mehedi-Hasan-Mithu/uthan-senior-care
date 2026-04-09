import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

async function fetchAndMergeRole(authUser) {
  if (!authUser) return null;

  const { data } = await supabase
    .from('user_roles')
    .select('role, full_name, status')
    .eq('email', authUser.email)
    .single();

  return {
    id: authUser.id,
    email: authUser.email,
    role: data?.role ?? 'member',
    fullName: data?.full_name ?? authUser.email,
    status: data?.status ?? 'active',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef(false);

  const loadUserWithRole = async (authUser) => {
    if (!authUser || fetchingRef.current) return;

    fetchingRef.current = true;
    try {
      // Small delay to avoid immediate conflicts with token refresh
      await new Promise(resolve => setTimeout(resolve, 100));
      const merged = await fetchAndMergeRole(authUser);
      setUser(merged);
    } catch (error) {
      console.error('Error fetching user role:', error);
      // Fallback to basic user info
      setUser({
        id: authUser.id,
        email: authUser.email,
        role: 'member',
        fullName: authUser.email,
        status: 'active',
      });
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await loadUserWithRole(session.user);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadUserWithRole(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function signUp(email, password, fullName, phone) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
        emailRedirectTo: `${window.location.origin}/signin`,
      },
    });

    if (!error && data?.user) {
      // Insert into user_roles on sign up
      await supabase.from('user_roles').insert({
        email,
        user_id: data.user.id,
        full_name: fullName,
        role: 'member',
        status: 'active',
      });
    }

    return { data, error };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
