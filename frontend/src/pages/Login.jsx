import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields.');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    if (type === 'admin') setForm({ email: 'admin@civictrack.gov.in', password: 'Admin@1234' });
    else setForm({ email: 'demo@civictrack.in', password: 'User@1234' });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏙️ CivicTrack</div>
        <div className="auth-sub">Sign in to your account</div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 11 }} onClick={() => fillDemo('user')}>
            👤 Demo User
          </button>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 11 }} onClick={() => fillDemo('admin')}>
            🛡️ Demo Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }}></span> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray500)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}
