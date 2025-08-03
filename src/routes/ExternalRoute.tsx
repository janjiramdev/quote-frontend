import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../contexts/sessions/SessionContext';

export default function ExternalRoute() {
  const { isAuthenticated } = useSession();
  return isAuthenticated ? <Navigate to="/home" /> : <Outlet />;
}
