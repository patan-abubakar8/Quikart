import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Debug = () => {
  const { isAuthenticated, loading, user, error } = useAuth();
  const location = useLocation();

  return (
    <div className="p-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <div className="space-y-2">
        <p><strong>Current Path:</strong> {location.pathname}</p>
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user) : 'null'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>LocalStorage Token:</strong> {localStorage.getItem('token') || 'None'}</p>
        <p><strong>LocalStorage User:</strong> {localStorage.getItem('user') || 'None'}</p>
      </div>
    </div>
  );
};

export default Debug;