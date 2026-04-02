import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏙️ CivicTrack</div>
        <div className="auth-sub">Create your citizen account</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name <span>*</span></label>
            <input className="form-control" placeholder="e.g. Ravi Kumar" value={form.name} onChange={set('name')} autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address <span>*</span></label>
            <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input className="form-control" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Password <span>*</span></label>
              <input className="form-control" type="password" placeholder="Min 6 chars" value={form.password} onChange={set('password')} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password <span>*</span></label>
              <input className="form-control" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} />
            </div>
          </div>
          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }}></span> Creating account…</> : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray500)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
