import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, redirectTo = '/signin', allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm px-4">
        <div className="rounded-3xl bg-white p-8 shadow-2xl text-center">
          <div className="h-10 w-10 mx-auto mb-4 rounded-full border-4 border-gold border-t-transparent animate-spin" />
          <p className="text-sm text-gray-600">Checking your access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/checkin" replace />;
  }

  return children;
}
