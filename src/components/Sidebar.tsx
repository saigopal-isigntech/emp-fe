import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { currentRole } = useAuth();
  const isAdminOrHr = currentRole === 'ADMIN' || currentRole === 'HR';

  const navLinks = [
    { name: 'Dashboard', path: '/', visible: true },
    { name: 'Employees', path: '/employees', visible: isAdminOrHr },
    { name: 'Departments', path: '/departments', visible: isAdminOrHr },
    { name: 'Attendance & Leaves', path: '/attendance', visible: true },
  ].filter((link) => link.visible);

  return (
    <aside className="border-b border-slate-200 bg-white lg:fixed lg:top-14 lg:left-0 lg:h-[calc(100vh-3.5rem)] lg:w-56 lg:border-b-0 lg:border-r z-30 p-4">
      <nav className="flex flex-wrap gap-1 lg:flex-col">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            className={({ isActive }) =>
              'block rounded-lg px-3 py-2 text-sm font-medium transition-colors ' +
              (isActive
                ? 'bg-indigo-600 text-white font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900')
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
