import type { DashboardSummary } from '../types/api';
import {
  Users,
  UserCheck,
  Clock,
  CalendarOff,
  FileText,
  Building2,
} from 'lucide-react';

interface DashboardHeaderProps {
  summary: DashboardSummary;
  loading?: boolean;
}

function DashboardHeader({ summary, loading }: DashboardHeaderProps) {
  const stats = [
    {
      title: 'Total Staff',
      value: summary.totalEmployees,
      icon: Users,
      badgeBg: 'bg-indigo-50 text-[#4f46e5] border-indigo-100',
      tag: 'Headcount',
    },
    {
      title: 'Active Staff',
      value: summary.activeEmployees,
      icon: UserCheck,
      badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      tag: 'Operational',
    },
    {
      title: 'Present Today',
      value: summary.presentToday,
      icon: Clock,
      badgeBg: 'bg-sky-50 text-sky-600 border-sky-100',
      tag: 'Checked In',
    },
    {
      title: 'On Leave',
      value: summary.employeesOnLeave ?? 0,
      icon: CalendarOff,
      badgeBg: 'bg-amber-50 text-amber-600 border-amber-100',
      tag: 'Out Today',
    },
    {
      title: 'Pending Leaves',
      value: summary.pendingLeaves ?? summary.pendingLeaveRequests ?? 0,
      icon: FileText,
      badgeBg: 'bg-rose-50 text-rose-600 border-rose-100',
      tag: 'Requires Action',
    },
    {
      title: 'Departments',
      value: summary.totalDepartments,
      icon: Building2,
      badgeBg: 'bg-indigo-50 text-[#4338ca] border-indigo-100',
      tag: 'Units',
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="group relative rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(79,70,229,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate mr-1">
                {item.title}
              </span>
              <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-xl flex items-center justify-center border ${item.badgeBg} shadow-2xs flex-shrink-0`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-1">
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-[#1e293b]">
                {loading ? (
                  <div className="h-6 w-10 bg-slate-100 animate-pulse rounded"></div>
                ) : (
                  item.value
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-100 truncate max-w-[80px]">
                {item.tag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardHeader;
