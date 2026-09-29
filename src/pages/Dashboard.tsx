import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { useEmployeeContext } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary } from '../api/dashboardApi';
import { checkIn, checkOut, getMyAttendance } from '../api/attendanceApi';
import type { DashboardSummary } from '../types/api';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { employees, departments } = useEmployeeContext();
  const { currentRole, user } = useAuth();
  const isAdminOrHr = currentRole === 'ADMIN' || currentRole === 'HR';

  const [summary, setSummary] = useState<DashboardSummary>({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    totalDepartments: 0,
    presentToday: 0,
    absentToday: 0,
    halfDayToday: 0,
    pendingLeaveRequests: 0,
    approvedLeaveRequests: 0,
    rejectedLeaveRequests: 0,
    pendingLeaves: 0,
    employeesOnLeave: 0,
  });
  const [loading, setLoading] = useState(true);

  const [myAttendance, setMyAttendance] = useState<any[]>([]);
  const [punchMsg, setPunchMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [punching, setPunching] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (isAdminOrHr) {
          const live = await getDashboardSummary();
          setSummary(live);
        } else {
          const logs = await getMyAttendance();
          setMyAttendance(logs || []);
        }
      } catch {
        const activeCount = employees.filter((e) => e.status === 'ACTIVE').length;
        setSummary({
          totalEmployees: employees.length,
          activeEmployees: activeCount,
          inactiveEmployees: employees.length - activeCount,
          totalDepartments: departments.length,
          presentToday: 0,
          absentToday: 0,
          halfDayToday: 0,
          pendingLeaveRequests: 0,
          approvedLeaveRequests: 0,
          rejectedLeaveRequests: 0,
          pendingLeaves: 0,
          employeesOnLeave: 0,
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAdminOrHr, employees, departments]);

  const handleCheckIn = async () => {
    setPunching(true);
    setPunchMsg(null);
    try {
      await checkIn();
      setPunchMsg({ type: 'success', text: 'Checked in successfully.' });
      const logs = await getMyAttendance();
      setMyAttendance(logs || []);
    } catch (err: any) {
      setPunchMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Check-in failed.',
      });
    } finally {
      setPunching(false);
    }
  };

  const handleCheckOut = async () => {
    setPunching(true);
    setPunchMsg(null);
    try {
      await checkOut();
      setPunchMsg({ type: 'success', text: 'Checked out successfully.' });
      const logs = await getMyAttendance();
      setMyAttendance(logs || []);
    } catch (err: any) {
      setPunchMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Check-out failed.',
      });
    } finally {
      setPunching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800">
          Welcome, {user?.name || user?.email || 'User'}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of system operations.</p>
      </div>

      {punchMsg && (
        <div
          className={`p-3 rounded-lg text-sm font-medium ${
            punchMsg.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {punchMsg.text}
        </div>
      )}

      {isAdminOrHr ? (
        <>
          <DashboardHeader summary={summary} loading={loading} />

          <div className="grid gap-4 md:grid-cols-3 pt-2">
            <Link
              to="/employees"
              className="rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-500 hover:shadow-xs transition-all"
            >
              <h2 className="text-base font-semibold text-slate-800">Employee Directory</h2>
              <p className="text-xs text-slate-500 mt-1">Manage staff records and information.</p>
            </Link>

            <Link
              to="/departments"
              className="rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-500 hover:shadow-xs transition-all"
            >
              <h2 className="text-base font-semibold text-slate-800">Departments</h2>
              <p className="text-xs text-slate-500 mt-1">Manage organizational units and divisions.</p>
            </Link>

            <Link
              to="/attendance"
              className="rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-500 hover:shadow-xs transition-all"
            >
              <h2 className="text-base font-semibold text-slate-800">Attendance & Leaves</h2>
              <p className="text-xs text-slate-500 mt-1">View attendance records and leave applications.</p>
            </Link>
          </div>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Daily Attendance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Punch in and out for your shift.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCheckIn}
                disabled={punching}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                Clock In
              </button>
              <button
                onClick={handleCheckOut}
                disabled={punching}
                className="flex-1 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50"
              >
                Clock Out
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">My Attendance Records</h2>
              <p className="text-xs text-slate-500 mt-0.5">Total recorded logs: {myAttendance.length}</p>
            </div>
            <Link
              to="/attendance"
              className="mt-4 inline-block text-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Go to Attendance Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
