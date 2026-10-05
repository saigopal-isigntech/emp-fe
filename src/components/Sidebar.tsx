import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck2,
  FileText,
  UserCheck,
  ShieldCheck,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { currentRole } = useAuth();
  const isAdmin = currentRole === 'ADMIN';
  const isHr = currentRole === 'HR';

  // Role-tailored modules navigation with unique, distinct URLs
  const getNavSections = () => {
    if (isAdmin) {
      return [
        {
          title: 'Executive Overview',
          links: [
            { name: 'Admin Dashboard', path: '/', icon: LayoutDashboard, badge: 'Overview' },
          ]
        },
        {
          title: 'Staff & Governance',
          links: [
            { name: 'Employee Directory', path: '/employees', icon: Users, badge: 'Staff' },
            { name: 'Department Units', path: '/departments', icon: Building2, badge: 'Units' },
          ]
        },
        {
          title: 'Operations',
          links: [
            { name: 'Attendance Desk', path: '/attendance', icon: CalendarCheck2, badge: 'Logs' },
            { name: 'Leave Management', path: '/leaves', icon: FileText, badge: 'Requests' },
            { name: 'My Profile', path: '/profile', icon: UserCheck, badge: 'Account' },
          ]
        }
      ];
    }

    if (isHr) {
      return [
        {
          title: 'HR Operations',
          links: [
            { name: 'HR Dashboard', path: '/', icon: LayoutDashboard, badge: 'Metrics' },
          ]
        },
        {
          title: 'Workforce Management',
          links: [
            { name: 'Staff Directory', path: '/employees', icon: Users, badge: 'Staff' },
            { name: 'Department Units', path: '/departments', icon: Building2, badge: 'Units' },
          ]
        },
        {
          title: 'Time & Leave Desk',
          links: [
            { name: 'Attendance Desk', path: '/attendance', icon: CalendarCheck2, badge: 'Shifts' },
            { name: 'Leave Review', path: '/leaves', icon: FileText, badge: 'Review' },
            { name: 'My Profile', path: '/profile', icon: UserCheck, badge: 'Account' },
          ]
        }
      ];
    }

    // EMPLOYEE Role (Employee Self-Service)
    return [
      {
        title: 'Employee Portal',
        links: [
          { name: 'My Dashboard', path: '/', icon: LayoutDashboard, badge: 'Portal' },
        ]
      },
      {
        title: 'Self-Service Desk',
        links: [
          { name: 'Attendance Shifts', path: '/attendance', icon: CalendarCheck2, badge: 'Punch' },
          { name: 'Leave & Time Off', path: '/leaves', icon: FileText, badge: 'Leaves' },
          { name: 'My Profile & Details', path: '/profile', icon: UserCheck, badge: 'My Info' },
        ]
      }
    ];
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* Responsive Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-64 lg:shadow-[1px_0_10px_rgba(79,70,229,0.02)] ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-5 overflow-y-auto pr-1">
            {/* Mobile Header in Drawer */}
            <div className="flex lg:hidden items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#4338ca] via-[#4f46e5] to-[#6366f1] flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-slate-800 tracking-tight">
                  EMS Portal
                </span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {navSections.map((section) => (
              <div key={section.title} className="space-y-1.5">
                <p className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {section.title}
                </p>
                <nav className="flex flex-col gap-1">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/'}
                        onClick={() => onClose && onClose()}
                        className={({ isActive }) =>
                          'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ' +
                          (isActive
                            ? 'bg-indigo-50/90 text-[#4f46e5] border border-indigo-100 shadow-2xs font-bold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent')
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-3">
                              <Icon
                                className={`w-4 h-4 transition-colors ${
                                  isActive ? 'text-[#4f46e5]' : 'text-slate-400 group-hover:text-slate-600'
                                }`}
                              />
                              <span>{link.name}</span>
                            </div>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded-md font-medium border ${
                                isActive
                                  ? 'bg-indigo-100/90 text-[#4338ca] border-indigo-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200/60'
                              }`}
                            >
                              {link.badge}
                            </span>
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border border-indigo-100/70 shadow-xs">
            <div className="flex items-center gap-2 text-[#4338ca] text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4f46e5]" />
              <span>Active Role</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Logged in as <strong className="text-slate-800 font-bold">{currentRole}</strong>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
