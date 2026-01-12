import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// props and children
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <h3>🚫 Access Denied</h3>;
  }

  return children;
}
