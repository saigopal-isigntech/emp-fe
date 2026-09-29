import type { DashboardSummary } from '../types/api';

interface DashboardHeaderProps {
  summary: DashboardSummary;
  loading?: boolean;
}

function DashboardHeader({ summary, loading }: DashboardHeaderProps) {
  const stats = [
    { title: 'Total Staff', value: summary.totalEmployees },
    { title: 'Active Staff', value: summary.activeEmployees },
    { title: 'Present Today', value: summary.presentToday },
    { title: 'On Leave', value: summary.employeesOnLeave ?? 0 },
    { title: 'Pending Leaves', value: summary.pendingLeaves ?? summary.pendingLeaveRequests ?? 0 },
    { title: 'Departments', value: summary.totalDepartments },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
        >
          <span className="text-xs font-medium text-slate-500">{item.title}</span>
          <div className="mt-2 text-2xl font-bold text-slate-800">
            {loading ? '...' : item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardHeader;
