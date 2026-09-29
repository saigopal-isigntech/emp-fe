import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Header() {
  const { user, currentRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <Link to="/" className="text-base font-bold text-slate-800 hover:text-indigo-600">
        Employee Management System
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">{user?.email || 'User'}</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            {currentRole}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
