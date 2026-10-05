import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, LogOut, ShieldCheck, Menu, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user, currentRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeStyle = () => {
    switch (currentRole) {
      case 'ADMIN':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'HR':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getUserInitials = () => {
    if (user?.name) {
      const parts = user.name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return user.name.slice(0, 2).toUpperCase();
    }
    return user?.email ? user.email.slice(0, 2).toUpperCase() : 'US';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shadow-[0_2px_10px_rgba(79,70,229,0.03)]">
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-[#4f46e5]" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#4338ca] via-[#4f46e5] to-[#6366f1] flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="hidden sm:inline text-base font-bold tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
              Employee HR Management System
            </span>
            <span className="sm:hidden text-sm font-bold tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
              EMS Portal
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 sm:border-l sm:border-slate-200">
          <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shadow-2xs flex-shrink-0">
            {getUserInitials()}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-700 leading-tight max-w-[130px] truncate">
              {user?.name || user?.email || 'User'}
            </span>
            <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[130px]">
              {user?.email}
            </span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold border ${getRoleBadgeStyle()}`}>
            <ShieldCheck className="w-3 h-3" />
            <span>{currentRole}</span>
          </span>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 shadow-2xs transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
