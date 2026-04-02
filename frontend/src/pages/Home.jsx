import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ISSUE_TYPES = [
  { icon: '💡', label: 'Street Lights', desc: 'Broken or missing street lights' },
  { icon: '💧', label: 'Water Leakage', desc: 'Pipe leaks, water wastage' },
  { icon: '🌧️', label: 'Rainwater', desc: 'Drainage issues, flooding' },
];

const STEPS = [
  { icon: '📝', step: '01', title: 'Register & Login', desc: 'Create your account in seconds using email or Google' },
  { icon: '📍', step: '02', title: 'Submit Complaint', desc: 'Fill in the details of the issue with your location' },
  { icon: '🔍', step: '03', title: 'Track Progress', desc: 'Get real-time status updates on your complaint' },
  { icon: '✅', step: '04', title: 'Issue Resolved', desc: 'Rate the service and leave feedback after resolution' },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,.15)', borderRadius: 999, padding: '6px 16px', fontSize: 13, marginBottom: 20 }}>
            🏙️ Urban Civic Management Platform
          </div>
          <h1 className="hero-title">Report. Track.<br />Get It Fixed.</h1>
          <p className="hero-sub">Submit civic complaints directly to municipal authorities. Street lights, water leakages, drainage — we handle it all.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : '/submit'} className="btn btn-lg" style={{ background: '#fff', color: 'var(--brand)' }}>
                {user.role === 'admin' ? 'Go to Dashboard' : '+ Submit a Complaint'}
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: 'var(--brand)' }}>Get Started Free</Link>
                <Link to="/track" className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}>Track a Complaint</Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            {[['1,284', 'Complaints Filed'], ['847', 'Issues Resolved'], ['66%', 'Resolution Rate'], ['24hr', 'Avg Response']].map(([n, l]) => (
              <div key={l}>
                <div className="hero-stat-num">{n}</div>
                <div className="hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issue types */}
      <div style={{ background: '#fff', padding: '64px 24px', borderBottom: '1px solid var(--gray200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="heading" style={{ fontSize: 32, marginBottom: 10 }}>Issues We Handle</h2>
            <p style={{ color: 'var(--gray500)', fontSize: 16 }}>File complaints for common urban civic problems</p>
          </div>
          <div className="grid-3" style={{ maxWidth: 800, margin: '0 auto' }}>
            {ISSUE_TYPES.map(({ icon, label, desc }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{label}</div>
                <div style={{ color: 'var(--gray500)', fontSize: 14 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '64px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="heading" style={{ fontSize: 32, marginBottom: 10 }}>How It Works</h2>
            <p style={{ color: 'var(--gray500)', fontSize: 16 }}>Four simple steps to get your issue resolved</p>
          </div>
          <div className="grid-4">
            {STEPS.map(({ icon, step, title, desc }) => (
              <div key={step} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>{icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', letterSpacing: 2, marginBottom: 6 }}>STEP {step}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{title}</div>
                <div style={{ color: 'var(--gray500)', fontSize: 13 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      {!user && (
        <div style={{ background: 'var(--brand)', padding: '64px 24px', textAlign: 'center', color: '#fff' }}>
          <h2 className="heading" style={{ fontSize: 32, marginBottom: 12 }}>Ready to file your complaint?</h2>
          <p style={{ opacity: .8, fontSize: 16, marginBottom: 28 }}>Join thousands of citizens making their city better</p>
          <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: 'var(--brand)' }}>Create Free Account</Link>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: 'var(--gray900)', color: 'var(--gray400)', padding: '32px 24px', textAlign: 'center', fontSize: 14 }}>
        <div className="heading" style={{ color: '#fff', fontSize: 18, marginBottom: 8 }}>🏙️ CivicTrack</div>
        <p>Online Complaint Registration & Management System</p>
        <p style={{ marginTop: 8 }}>© {new Date().getFullYear()} Municipal Corporation. All rights reserved.</p>
      </footer>
    </div>
  );
}
