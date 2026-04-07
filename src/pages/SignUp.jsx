import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo.webp';

function SignUp() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'At least 8 characters.';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStatus('loading');
    setServerError('');
    const { error } = await signUp(form.email, form.password, form.name, form.phone);
    if (error) {
      setServerError(error.message);
      setStatus('error');
    } else {
      setStatus('success');
    }
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

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-navy font-bold mb-2">Check Your Email</h2>
          <p className="text-gray-500 text-sm mb-2">
            We sent a verification link to <span className="font-semibold text-navy">{form.email}</span>.
          </p>
          <p className="text-gray-400 text-xs mb-6">Click the link in the email to activate your account, then sign in.</p>
          <Link to="/signin"
            className="inline-block w-full py-3 rounded-full bg-gold text-white font-semibold text-sm text-center hover:bg-green-dark transition">
            Go to Sign In
          </Link>
          <p className="mt-4 text-xs text-gray-400">
            <Link to="/" className="hover:text-gold transition">← Back to home</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gold px-8 pt-10 pb-8 text-center">
            <img src={logo} alt="Uthan Senior Care" className="h-14 w-auto mx-auto mb-4 object-contain" />
            <h1 className="font-serif text-2xl font-bold text-white">Create Account</h1>
            <p className="text-white/80 text-sm mt-1">Join the Uthan Senior Care family</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-8 py-8 flex flex-col gap-4">
            {serverError && (
              <div role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {serverError}
              </div>
            )}

            {[
              { id: 'su-name', field: 'name', type: 'text', label: 'Full Name', placeholder: 'Jane Smith', icon: FiUser, ac: 'name' },
              { id: 'su-email', field: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', icon: FiMail, ac: 'email' },
              { id: 'su-phone', field: 'phone', type: 'tel', label: 'Phone', placeholder: '(555) 000-0000', icon: FiPhone, ac: 'tel' },
            ].map(({ id, field, type, label, placeholder, icon: Icon, ac }) => (
              <div key={field} className="flex flex-col gap-1">
                <label htmlFor={id} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input id={id} type={type} value={form[field]} onChange={set(field)}
                    placeholder={placeholder} autoComplete={ac} className={inputCls(field)} />
                </div>
                {errors[field] && <p className="text-red-500 text-xs">{errors[field]}</p>}
              </div>
            ))}

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="su-password" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input id="su-password" type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={set('password')} placeholder="Min. 8 characters" autoComplete="new-password"
                  className={`${inputCls('password')} pr-10`} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div className="flex flex-col gap-1">
              <label htmlFor="su-confirm" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input id="su-confirm" type={showPw ? 'text' : 'password'} value={form.confirm}
                  onChange={set('confirm')} placeholder="Repeat password" autoComplete="new-password"
                  className={inputCls('confirm')} />
              </div>
              {errors.confirm && <p className="text-red-500 text-xs">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={status === 'loading'}
              className="mt-2 w-full py-3 rounded-full bg-gold text-white font-semibold text-sm hover:bg-green-dark transition disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2">
              {status === 'loading' ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/signin" className="text-gold font-semibold hover:underline">Sign in</Link>
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

export default SignUp;
