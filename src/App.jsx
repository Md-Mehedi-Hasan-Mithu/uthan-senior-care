import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import FloatingCTA from './components/FloatingCTA';
import ChatWidget from './components/ChatWidget';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CheckIn from './pages/CheckIn';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm px-4">
        <div className="rounded-3xl bg-white p-8 shadow-2xl text-center">
          <div className="h-10 w-10 mx-auto mb-4 rounded-full border-4 border-gold border-t-transparent animate-spin" />
          <p className="text-sm text-gray-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <FloatingCTA />
      <ChatWidget />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signin"
          element={user ? <Navigate to="/checkin" replace /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/checkin" replace /> : <SignUp />}
        />
        <Route
          path="/checkin"
          element={
            <ProtectedRoute>
              <CheckIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectTo="/checkin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']} redirectTo="/checkin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
