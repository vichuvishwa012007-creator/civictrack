import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">🏙️ CivicTrack</Link>
        <div className="navbar-nav">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
              ) : (
                <>
                  <Link to="/dashboard" className={isActive('/dashboard')}>My Complaints</Link>
                  <Link to="/submit" className={isActive('/submit')}>Submit Issue</Link>
                  <Link to="/track" className={isActive('/track')}>Track</Link>
                </>
              )}
              <span style={{ fontSize: 13, color: 'var(--gray500)', padding: '0 8px' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button className="nav-link" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/track" className={isActive('/track')}>Track Complaint</Link>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/register" className="nav-link btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
