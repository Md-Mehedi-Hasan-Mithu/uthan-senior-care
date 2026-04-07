import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo.webp';

function SignIn() {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [serverError, setServerError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStatus('loading');
    setServerError('');
    const { error } = await signIn(form.email, form.password);
    if (error) {
      setServerError(error.message);
      setStatus('error');
    } else {
      navigate('/');
    }
  }

  async function handleReset() {
    if (!form.email.trim()) { setErrors({ email: 'Enter your email first.' }); return; }
    const { error } = await resetPassword(form.email);
    if (!error) setResetSent(true);
  }

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setErrors(p => ({ ...p, [field]: undefined }));
    setServerError('');
  };

  const inputCls = (field) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-gold transition ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`;

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gold px-8 pt-10 pb-8 text-center">
            <img src={logo} alt="Uthan Senior Care" className="h-14 w-auto mx-auto mb-4 object-contain" />
            <h1 className="font-serif text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/80 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-8 py-8 flex flex-col gap-5">
            {serverError && (
              <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {serverError}
              </div>
            )}
            {resetSent && (
              <div role="status" className="rounded-xl bg-green-light border border-gold/30 text-gray-700 text-sm px-4 py-3">
                Password reset email sent — check your inbox.
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="si-email" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input id="si-email" type="email" value={form.email} autoComplete="email"
                  onChange={set('email')} placeholder="you@example.com" className={inputCls('email')} />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="si-password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input id="si-password" type={showPw ? 'text' : 'password'} value={form.password}
                  autoComplete="current-password" onChange={set('password')} placeholder="••••••••"
                  className={`${inputCls('password')} pr-10`} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div className="flex justify-end -mt-2">
              <button type="button" onClick={handleReset}
                className="text-xs text-gold hover:underline focus:outline-none">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={status === 'loading'}
              className="w-full py-3 rounded-full bg-gold text-white font-semibold text-sm hover:bg-green-dark transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2">
              {status === 'loading' ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-gold font-semibold hover:underline">Create one</Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/" className="hover:text-gold transition">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
