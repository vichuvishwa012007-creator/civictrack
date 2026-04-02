import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import Feedback from './pages/Feedback';
import AdminLayout from './pages/AdminLayout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans, sans-serif', fontSize: 14 } }} />
        <Routes>
          {/* Admin - no top navbar */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <Navbar />
              <AdminLayout />
            </ProtectedRoute>
          } />

          {/* All other routes with navbar */}
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/track" element={<TrackComplaint />} />
                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/submit" element={<ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
                <Route path="/feedback/:complaintId" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
                <Route path="*" element={
                  <div className="content-wrap" style={{ textAlign: 'center', paddingTop: 80 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🏙️</div>
                    <h1 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>404 – Page Not Found</h1>
                    <a href="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Go Home</a>
                  </div>
                } />
              </Routes>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
