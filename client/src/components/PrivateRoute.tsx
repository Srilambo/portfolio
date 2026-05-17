import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  // Automatically bypass login in local development mode to make testing dashboard settings seamless
  const isDevBypass = import.meta.env.DEV;
  return (isAuthenticated || isDevBypass) ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
