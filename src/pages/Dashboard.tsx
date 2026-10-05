import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { useEmployeeContext } from '../context/EmployeeContext';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary } from '../api/dashboardApi';
import { checkIn, checkOut, getMyAttendance } from '../api/attendanceApi';
import { getMyProfile } from '../api/employeeApi';
import { getAllLeaves, getMyLeaves, approveLeave, rejectLeave, applyLeave, getMyLeaveBalance } from '../api/leaveApi';
import type { DashboardSummary, LeaveRequest, Attendance, LeaveType, Employee, LeaveBalanceResponse } from '../types/api';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  CalendarCheck2,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Check,
  X,
  FileText,
  Mail,
  CalendarDays,
  User,
  UserCheck
} from 'lucide-react';

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

  // Employee-specific state (strictly personal)
  const [liveEmpProfile, setLiveEmpProfile] = useState<Employee | null>(null);
  const [myAttendance, setMyAttendance] = useState<Attendance[]>([]);
  const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
  const [pendingLeavesList, setPendingLeavesList] = useState<LeaveRequest[]>([]);
  const [myBalance, setMyBalance] = useState<LeaveBalanceResponse | null>(null);
  const [leaveModalError, setLeaveModalError] = useState<string | null>(null);
  const [punchMsg, setPunchMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [punching, setPunching] = useState(false);

  // Quick leave apply modal
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "CASUAL" as LeaveType,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
  });

  // Auto-dismiss punch status alert after 2 seconds (2000ms)
  useEffect(() => {
    if (punchMsg) {
      const timer = setTimeout(() => {
        setPunchMsg(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [punchMsg]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (isAdminOrHr) {
          // ADMIN & HR: Load company-wide aggregate summary and all pending leaves
          const live = await getDashboardSummary();
          setSummary(live);
          try {
            const leaves = await getAllLeaves();
            setPendingLeavesList((leaves || []).filter(l => l.status === 'PENDING').slice(0, 5));
          } catch {
            // fallback
          }
        } else {
          // EMPLOYEE: Load STRICTLY their own attendance, leaves, and balance
          const [logs, leaves, prof, bal] = await Promise.all([
            getMyAttendance().catch(() => []),
            getMyLeaves().catch(() => []),
            getMyProfile().catch(() => null),
            getMyLeaveBalance().catch(() => null),
          ]);
          if (prof) setLiveEmpProfile(prof);
          setMyAttendance(logs || []);
          setMyLeaves(leaves || []);
          if (bal) setMyBalance(bal);
        }
      } catch {
        if (isAdminOrHr) {
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
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAdminOrHr]);

  const handleCheckIn = async () => {
    setPunching(true);
    setPunchMsg(null);
    try {
      await checkIn();
      setPunchMsg({ type: 'success', text: 'Checked in successfully for today.' });
      const logs = await getMyAttendance();
      setMyAttendance(logs || []);
    } catch (err: any) {
      setPunchMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Check-in failed. Please try again.',
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
      setPunchMsg({ type: 'success', text: 'Checked out successfully for today.' });
      const logs = await getMyAttendance();
      setMyAttendance(logs || []);
    } catch (err: any) {
      setPunchMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Check-out failed. Please try again.',
      });
    } finally {
      setPunching(false);
    }
  };

  const handleQuickApprove = async (id?: number) => {
    if (!id) return;
    try {
      await approveLeave(id);
      setPendingLeavesList(prev => prev.filter(l => l.id !== id));
      setPunchMsg({ type: 'success', text: 'Leave request approved.' });
    } catch {
      setPunchMsg({ type: 'error', text: 'Failed to approve leave.' });
    }
  };

  const handleQuickReject = async (id?: number) => {
    if (!id) return;
    try {
      await rejectLeave(id, 'Rejected by reviewer');
      setPendingLeavesList(prev => prev.filter(l => l.id !== id));
      setPunchMsg({ type: 'success', text: 'Leave request rejected.' });
    } catch {
      setPunchMsg({ type: 'error', text: 'Failed to reject leave.' });
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveModalError(null);
    try {
      await applyLeave({
        employeeId: user?.employeeId || 1,
        leaveType: leaveForm.leaveType,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason,
      });
      setIsLeaveModalOpen(false);
      setPunchMsg({ type: 'success', text: 'Leave application submitted successfully!' });
      const [leaves, bal] = await Promise.all([
        getMyLeaves().catch(() => []),
        getMyLeaveBalance().catch(() => null)
      ]);
      setMyLeaves(leaves || []);
      if (bal) setMyBalance(bal);
    } catch (err: any) {
      setLeaveModalError(err?.response?.data?.message || 'Failed to submit leave request. Please check your dates and balance.');
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const todayIso = new Date().toISOString().split('T')[0];

  // Employee-specific resolved details
  const myEmployeeRecord = liveEmpProfile || employees.find(
    e => e.userId === user?.userId || (user?.employeeId && e.id === user.employeeId) || e.email === user?.email
  );

  const myDisplayName = myEmployeeRecord
    ? (myEmployeeRecord.name || (myEmployeeRecord.firstName + ' ' + (myEmployeeRecord.lastName && myEmployeeRecord.lastName !== '-' ? myEmployeeRecord.lastName : '')).trim())
    : (user?.name || user?.email?.split('@')[0] || 'Employee');

  const myDepartment = myEmployeeRecord?.department || myEmployeeRecord?.departmentName || "General";
  const myDesignation = myEmployeeRecord?.designation || "Staff Member";
  const myEmployeeCode = myEmployeeRecord?.employeeCode || (user?.employeeId ? ("EMP-" + user.employeeId) : "EMP-001");
  const myEmail = myEmployeeRecord?.email || user?.email || "";
  const myJoinDate = myEmployeeRecord?.dateOfJoining || "Recent";

  // Check today's shift log
  const todayAttendance = myAttendance.find(a => a.attendanceDate === todayIso) || myAttendance[0];
  const todayCheckedIn = !!todayAttendance?.checkIn;
  const todayCheckedOut = !!todayAttendance?.checkOut;

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "–";
    try {
      if (timeStr.includes("T")) {
        const parts = timeStr.split("T");
        if (parts[1]) {
          return parts[1].split(".")[0];
        }
      }
      return timeStr;
    } catch {
      return timeStr;
    }
  };

  const totalEmployees = summary.totalEmployees || 1;
  const presentPct = Math.round(((summary.presentToday || 0) / totalEmployees) * 100);
  const onLeavePct = Math.round((((summary.employeesOnLeave || 0)) / totalEmployees) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/50 p-6 sm:p-7 shadow-[0_4px_20px_rgba(79,70,229,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#4f46e5] text-xs font-bold mb-1.5">
            <Sparkles className="w-4 h-4 text-[#4f46e5]" />
            <span>
              {isAdminOrHr ? "Administrative Operations Hub" : "Employee Self-Service Portal"}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1e293b]">
            Welcome back, {isAdminOrHr ? (user?.name || 'Administrator') : myDisplayName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAdminOrHr
              ? "Real-time company-wide workforce metrics, shift logs, and pending administrative tasks."
              : "Manage your personal work shifts, review your time-off applications, and track your employment record."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs text-xs text-slate-700 font-medium">
            <Calendar className="w-4 h-4 text-[#4f46e5]" />
            <span>{todayFormatted}</span>
          </div>
        </div>
      </div>

      {punchMsg && (
        <div
          className={"p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between border shadow-2xs transition-all duration-300 " + (
            punchMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          )}
        >
          <div className="flex items-center gap-2">
            {punchMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{punchMsg.text}</span>
          </div>
          <button onClick={() => setPunchMsg(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ADMIN & HR DASHBOARD VIEW: Shows Company-Wide Aggregate Data */}
      {isAdminOrHr ? (
        <>
          {/* 6 Global Company KPI Cards */}
          <DashboardHeader summary={summary} loading={loading} />

          {/* Attendance Ratio Bar */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4f46e5]" />
                <span>Today's Company Attendance Ratio</span>
              </span>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  Present ({summary.presentToday || 0})
                </span>
                <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                  On Leave ({summary.employeesOnLeave || 0})
                </span>
                <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                  Unrecorded ({Math.max(0, (summary.totalEmployees || 0) - (summary.presentToday || 0) - (summary.employeesOnLeave || 0))})
                </span>
              </div>
            </div>

            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: (Math.min(100, Math.max(0, presentPct)) + "%") }}
                className="bg-emerald-500 transition-all duration-500"
              ></div>
              <div
                style={{ width: (Math.min(100, Math.max(0, onLeavePct)) + "%") }}
                className="bg-amber-400 transition-all duration-500"
              ></div>
            </div>
          </div>

          {/* 2-Column Operational Grid */}
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Left Column: Pending Leaves */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                      <CalendarCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-800">Pending Leave Approvals</h2>
                      <p className="text-[11px] text-slate-500">Applications awaiting administrative review</p>
                    </div>
                  </div>
                  <Link
                    to="/leaves"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] transition-colors"
                  >
                    <span>View All ({summary.pendingLeaveRequests || 0})</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {pendingLeavesList.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">All caught up!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No pending leave applications requiring action.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {pendingLeavesList.map((req) => (
                      <div
                        key={req.id}
                        className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">
                              {req.employeeName || ("Employee #" + req.employeeId)}
                            </span>
                            <span className="rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-semibold text-[#4338ca]">
                              {req.leaveType}
                            </span>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-1">
                            {req.startDate} to {req.endDate} • {req.reason || 'No specific note'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleQuickApprove(req.id)}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm shadow-emerald-200 transition-all cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleQuickReject(req.id)}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Hub Navigation Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  to="/employees"
                  className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5] group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">Employee Directory</h3>
                      <p className="text-[11px] text-slate-500">{summary.totalEmployees || 0} registered staff</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4f46e5] group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/attendance"
                  className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">Attendance Desk</h3>
                      <p className="text-[11px] text-slate-500">Live check-ins & records</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>

            {/* Right Column: Department snapshot */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h2 className="text-sm font-bold text-slate-800">Departments Overview</h2>
                  <span className="text-[11px] font-semibold text-slate-400">{departments.length} Units</span>
                </div>

                <div className="space-y-2">
                  {departments.slice(0, 5).map((dept) => {
                    const count = employees.filter(
                      e => e.departmentId === dept.id || e.department === dept.name || e.departmentName === dept.name
                    ).length;
                    return (
                      <div
                        key={dept.id}
                        className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-700 truncate max-w-[130px]">{dept.name}</span>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#4f46e5] border border-slate-200 shadow-2xs">
                          {count} staff
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                to="/departments"
                className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-indigo-50 hover:text-[#4f46e5] hover:border-indigo-200 text-xs font-semibold text-slate-700 transition-all text-center block shadow-2xs"
              >
                Manage All Units ({departments.length})
              </Link>
            </div>
          </div>
        </>
      ) : (
        /* EMPLOYEE DASHBOARD VIEW: strictly personalized attendance & leaves */
        <div className="space-y-6">
          {/* Quick Shift & Punch Action Widget */}
          <div className="grid gap-5 md:grid-cols-3">
            {/* Shift Tracker Card */}
            <div className="md:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Today's Work Shift</h2>
                    <p className="text-[11px] text-slate-500">Record check-in and check-out timestamps</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 text-[10px] border border-slate-200">
                  {todayIso}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Check-In Time
                  </span>
                  <span className="text-base font-bold text-slate-800">
                    {todayAttendance?.checkIn ? formatTime(todayAttendance.checkIn) : "Not Recorded"}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 text-center">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Check-Out Time
                  </span>
                  <span className="text-base font-bold text-slate-800">
                    {todayAttendance?.checkOut ? formatTime(todayAttendance.checkOut) : "Not Recorded"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={handleCheckIn}
                  disabled={punching || todayCheckedIn}
                  className="flex-1 min-w-[140px] py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{todayCheckedIn ? "Checked In Today" : "Punch In Now"}</span>
                </button>

                <button
                  onClick={handleCheckOut}
                  disabled={punching || !todayCheckedIn || todayCheckedOut}
                  className="flex-1 min-w-[140px] py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>{todayCheckedOut ? "Checked Out Today" : "Punch Out Now"}</span>
                </button>
              </div>
            </div>

            {/* Quick Time Off Action Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(79,70,229,0.03)] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="h-9 w-9 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
                    <CalendarCheck2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    Annual Quotas ({myBalance?.year || new Date().getFullYear()})
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">My Leave Balances</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Company annual quotas decided by Admin:
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Casual</span>
                    <span className="text-xs font-bold text-indigo-700">
                      {myBalance?.balances.find(b => b.leaveType === 'CASUAL')?.remainingDays ?? 12} / {myBalance?.balances.find(b => b.leaveType === 'CASUAL')?.totalQuota ?? 12}
                    </span>
                    <span className="text-[9px] text-slate-400 block">left</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Sick</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {myBalance?.balances.find(b => b.leaveType === 'SICK')?.remainingDays ?? 10} / {myBalance?.balances.find(b => b.leaveType === 'SICK')?.totalQuota ?? 10}
                    </span>
                    <span className="text-[9px] text-slate-400 block">left</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Unpaid</span>
                    <span className="text-xs font-bold text-amber-700">Unlimited</span>
                    <span className="text-[9px] text-slate-400 block">allowed</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setLeaveModalError(null); setIsLeaveModalOpen(true); }}
                className="w-full py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Apply for Leave</span>
              </button>
            </div>
          </div>

          {/* 2-Column: Recent Attendance and Recent Leave Applications */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* My Recent Attendance Logs */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#4f46e5]" />
                  <h3 className="text-xs font-bold text-slate-800">Recent Attendance History</h3>
                </div>
                <Link
                  to="/attendance"
                  className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] inline-flex items-center gap-1"
                >
                  <span>All Records</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {myAttendance.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  No attendance entries found. Punch in above to start your log.
                </div>
              ) : (
                <div className="space-y-2">
                  {myAttendance.slice(0, 5).map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700">{log.attendanceDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono text-[11px]">
                          In: {formatTime(log.checkIn)} | Out: {formatTime(log.checkOut)}
                        </span>
                        <span className={"rounded-full px-2 py-0.5 text-[10px] font-semibold border " + (
                          log.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : log.status === "HALF_DAY"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Leave Requests */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#4f46e5]" />
                  <h3 className="text-xs font-bold text-slate-800">My Leave Applications</h3>
                </div>
                <Link
                  to="/leaves"
                  className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] inline-flex items-center gap-1"
                >
                  <span>All Leaves</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {myLeaves.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  No leave applications submitted yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {myLeaves.slice(0, 5).map((leave) => (
                    <div
                      key={leave.id}
                      className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#4338ca] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 text-[10px]">
                            {leave.leaveType}
                          </span>
                          <span className="text-slate-700 font-medium">{leave.reason || "Time off"}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] mt-1">
                          {leave.startDate} to {leave.endDate}
                        </p>
                      </div>
                      <span className={"rounded-full px-2.5 py-0.5 text-[10px] font-semibold border " + (
                        leave.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : leave.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      )}>
                        {leave.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Profile Quick Summary Snapshot */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                My Employment Snapshot
              </span>
              <Link
                to="/profile"
                className="text-xs font-semibold text-[#4f46e5] hover:text-[#4338ca] inline-flex items-center gap-1"
              >
                <span>Full Profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <UserCheck className="w-4 h-4 text-[#4f46e5]" />
                <span className="truncate font-medium">{myDesignation}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <User className="w-4 h-4 text-[#4f46e5]" />
                <span className="truncate font-medium">{myEmployeeCode}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <Building2 className="w-4 h-4 text-[#4f46e5]" />
                <span className="truncate font-medium">{myDepartment}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <Mail className="w-4 h-4 text-[#4f46e5]" />
                <span className="truncate font-medium">{myEmail || "No Email"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <CalendarDays className="w-4 h-4 text-[#4f46e5]" />
                <span className="truncate font-medium">Joined: {myJoinDate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Apply for Time Off</h3>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs">
              {leaveModalError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  <div className="flex-1 leading-relaxed">{leaveModalError}</div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-700">Leave Category *</label>
                  {(() => {
                    const curBal = myBalance?.balances.find(b => b.leaveType === leaveForm.leaveType);
                    if (!curBal) return null;
                    return (
                      <span className="text-[11px] font-bold text-[#4f46e5] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {curBal.leaveType === 'UNPAID' ? 'Unlimited' : `${curBal.remainingDays} days left of ${curBal.totalQuota}`}
                      </span>
                    );
                  })()}
                </div>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => { setLeaveModalError(null); setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveType }); }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all cursor-pointer font-medium"
                >
                  <option value="CASUAL">
                    Casual Leave ({myBalance?.balances.find(b => b.leaveType === 'CASUAL')?.remainingDays ?? 12} days left of {myBalance?.balances.find(b => b.leaveType === 'CASUAL')?.totalQuota ?? 12})
                  </option>
                  <option value="SICK">
                    Sick Leave ({myBalance?.balances.find(b => b.leaveType === 'SICK')?.remainingDays ?? 10} days left of {myBalance?.balances.find(b => b.leaveType === 'SICK')?.totalQuota ?? 10})
                  </option>
                  <option value="UNPAID">Unpaid Leave (Unlimited)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">End Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Reason / Note *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the purpose of your leave request..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 border-t border-slate-100 bg-white shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer text-center"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
