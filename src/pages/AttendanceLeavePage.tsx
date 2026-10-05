import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkIn, checkOut, getAllAttendance, getMyAttendance } from "../api/attendanceApi";
import { getAllLeaves, getMyLeaves, applyLeave, approveLeave, rejectLeave, cancelLeave, getMyLeaveBalance, getLeaveBalanceByEmployee, getLeavePolicy, updateLeavePolicy } from "../api/leaveApi";
import { useAuth } from "../context/AuthContext";
import { useEmployeeContext } from "../context/EmployeeContext";
import type { Attendance, LeaveRequest, LeaveType, LeaveBalanceItem, LeaveBalanceResponse } from "../types/api";
import {
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Calendar,
  Check,
  RotateCw,
  ShieldCheck,
  Settings2,
  User as UserIcon
} from "lucide-react";

function AttendanceLeavePage() {
  const { currentRole, user } = useAuth();
  const { employees } = useEmployeeContext();
  const location = useLocation();
  const navigate = useNavigate();

  // Distinct active tab synchronized with unique URL paths (/attendance vs /leaves)
  const isLeavesUrl = location.pathname.includes("/leaves");
  const [activeTab, setActiveTab] = useState<"attendance" | "leaves">(isLeavesUrl ? "leaves" : "attendance");

  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [punchMessage, setPunchMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Synchronize state when URL path changes
  useEffect(() => {
    if (location.pathname.includes("/leaves")) {
      setActiveTab("leaves");
    } else {
      setActiveTab("attendance");
    }
  }, [location.pathname]);

  // Auto-dismiss punch status alert after 2 seconds (2000ms)
  useEffect(() => {
    if (punchMessage) {
      const timer = setTimeout(() => {
        setPunchMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [punchMessage]);

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceResponse | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyForm, setPolicyForm] = useState({ casualQuota: 12, sickQuota: 10, year: new Date().getFullYear() });
  const [savingPolicy, setSavingPolicy] = useState(false);
  const [selectedBalanceEmpId, setSelectedBalanceEmpId] = useState<number | null>(null);
  const [leaveForm, setLeaveForm] = useState({
    employeeId: 1,
    leaveType: "CASUAL" as LeaveType,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
  });

  const isAdminOrHr = currentRole === "ADMIN" || currentRole === "HR";

  useEffect(() => {
    if (activeTab === "attendance") {
      fetchAttendance();
    } else {
      fetchLeaves();
    }
  }, [activeTab, currentRole]);

  const handleTabSwitch = (tab: "attendance" | "leaves") => {
    setActiveTab(tab);
    if (tab === "leaves") {
      navigate("/leaves");
    } else {
      navigate("/attendance");
    }
  };

  
  const computeLeaveBalances = (leavesList: LeaveRequest[], year: number = new Date().getFullYear()): LeaveBalanceResponse => {
    const quotas: Record<LeaveType, number> = {
      CASUAL: policyForm.casualQuota || 12,
      SICK: policyForm.sickQuota || 10,
      UNPAID: 999,
    };

    const types: LeaveType[] = ["CASUAL", "SICK", "UNPAID"];

    const balances: LeaveBalanceItem[] = types.map((type) => {
      const quota = quotas[type] || 12;
      let usedDays = 0;
      let pendingDays = 0;

      leavesList.forEach((l) => {
        if (l.leaveType === type && l.startDate) {
          const leaveYear = new Date(l.startDate).getFullYear();
          if (leaveYear === year) {
            const start = new Date(l.startDate).getTime();
            const end = new Date(l.endDate || l.startDate).getTime();
            const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);

            if (l.status === "APPROVED") {
              usedDays += days;
            } else if (l.status === "PENDING") {
              pendingDays += days;
            }
          }
        }
      });

      const remainingDays = type === "UNPAID" ? 999 : Math.max(0, quota - (usedDays + pendingDays));

      return {
        leaveType: type,
        totalQuota: quota,
        usedDays,
        pendingDays,
        remainingDays,
      };
    });

    return {
      employeeId: user?.employeeId || 1,
      employeeName: user?.name || "My Account",
      year,
      balances,
    };
  };

  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    try {
      if (isAdminOrHr) {
        const data = await getAllAttendance();
        setAttendanceRecords(data || []);
      } else {
        const data = await getMyAttendance();
        setAttendanceRecords(data || []);
      }
    } catch {
      setAttendanceRecords([]);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const fetchLeaves = async (targetEmpId?: number | null | unknown) => {
    const empId = typeof targetEmpId === "number" ? targetEmpId : selectedBalanceEmpId;
    setLoadingLeaves(true);
    try {
      const [data, policy] = await Promise.all([
        isAdminOrHr ? getAllLeaves() : getMyLeaves(),
        getLeavePolicy().catch(() => null)
      ]);
      setLeaves(data || []);
      if (policy) {
        setPolicyForm({ casualQuota: policy.casualQuota, sickQuota: policy.sickQuota, year: policy.year || new Date().getFullYear() });
      }

      // Fetch balance for targeted employee or self
      let bal: LeaveBalanceResponse | null = null;
      if (empId) {
        bal = await getLeaveBalanceByEmployee(empId).catch(() => null);
      } else {
        bal = await getMyLeaveBalance().catch(() => null);
      }

      if (bal && bal.balances && bal.balances.length > 0) {
        setLeaveBalance(bal);
      } else {
        const empLeaves = empId ? (data || []).filter(l => l.employeeId === empId) : (data || []);
        setLeaveBalance(computeLeaveBalances(empLeaves));
      }
    } catch {
      setLeaves([]);
      setLeaveBalance(computeLeaveBalances([]));
    } finally {
      setLoadingLeaves(false);
    }
  };

  const handleSelectBalanceEmployee = (empIdStr: string) => {
    const empId = empIdStr ? Number(empIdStr) : null;
    setSelectedBalanceEmpId(empId);
    fetchLeaves(empId);
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPolicy(true);
    try {
      await updateLeavePolicy({
        year: policyForm.year,
        casualQuota: Number(policyForm.casualQuota),
        sickQuota: Number(policyForm.sickQuota),
      });
      setIsPolicyModalOpen(false);
      fetchLeaves(selectedBalanceEmpId);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update annual leave quota policy");
    } finally {
      setSavingPolicy(false);
    }
  };

  const handlePunchIn = async () => {
    setPunchMessage(null);
    try {
      await checkIn();
      setPunchMessage({ type: "success", text: "Checked in successfully!" });
      fetchAttendance();
    } catch (err: any) {
      setPunchMessage({ type: "error", text: err?.response?.data?.message || "Check-in failed" });
    }
  };

  const handlePunchOut = async () => {
    setPunchMessage(null);
    try {
      await checkOut();
      setPunchMessage({ type: "success", text: "Checked out successfully!" });
      fetchAttendance();
    } catch (err: any) {
      setPunchMessage({ type: "error", text: err?.response?.data?.message || "Check-out failed" });
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    // 1. Client-side duplicate / same-day overlap prevention
    const startDate = leaveForm.startDate;
    const endDate = leaveForm.endDate || leaveForm.startDate;

    if (endDate < startDate) {
      setModalError("End date cannot be before start date.");
      return;
    }

    const duplicate = leaves.find((l) => {
      if (l.status !== "PENDING" && l.status !== "APPROVED") return false;
      const lStart = l.startDate;
      const lEnd = l.endDate || l.startDate;
      return lStart <= endDate && lEnd >= startDate;
    });

    if (duplicate) {
      const isSameDay = duplicate.startDate === startDate && (duplicate.endDate || duplicate.startDate) === endDate;
      setModalError(
        isSameDay
          ? `You cannot apply for duplicate leaves on the same day (${startDate}). You already have an active ${duplicate.status} ${duplicate.leaveType} leave request${duplicate.reason ? ` (Reason: "${duplicate.reason}")` : ""}.`
          : `Duplicate Leave Detected: You already have an active ${duplicate.status} ${duplicate.leaveType} leave from ${duplicate.startDate} to ${duplicate.endDate || duplicate.startDate}${duplicate.reason ? ` (Reason: "${duplicate.reason}")` : ""}.`
      );
      return;
    }

    // 2. Client-side Quota validation
    const currentBalance = leaveBalance?.balances.find((b) => b.leaveType === leaveForm.leaveType);
    if (currentBalance && leaveForm.leaveType !== "UNPAID") {
      const days = Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
      if (days > currentBalance.remainingDays) {
        setModalError(
          `Insufficient ${leaveForm.leaveType} leave balance. You only have ${currentBalance.remainingDays} day(s) available (Quota: ${currentBalance.totalQuota}, Used/Pending: ${currentBalance.usedDays + currentBalance.pendingDays}), but requested ${days} day(s).`
        );
        return;
      }
    }

    try {
      const resolvedEmpId = user?.employeeId || leaveForm.employeeId || 1;
      await applyLeave({
        ...leaveForm,
        employeeId: resolvedEmpId,
      });
      setIsLeaveModalOpen(false);
      setLeaveForm({
        employeeId: 1,
        leaveType: "CASUAL",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        reason: "",
      });
      fetchLeaves();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to submit leave application";
      setModalError(msg);
    }
  };

  const handleApprove = async (id?: number) => {
    if (!id) return;
    try {
      await approveLeave(id);
      fetchLeaves();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to approve leave");
    }
  };

  const handleReject = async (id?: number) => {
    if (!id) return;
    const reason = prompt("Enter reason for rejection:") || "Rejected by administrator";
    try {
      await rejectLeave(id, reason);
      fetchLeaves();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to reject leave");
    }
  };

  const handleCancel = async (id?: number) => {
    if (!id) return;
    if (window.confirm("Cancel this leave request?")) {
      try {
        await cancelLeave(id);
        fetchLeaves();
      } catch (err: any) {
        alert(err?.response?.data?.message || "Failed to cancel leave");
      }
    }
  };

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

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1e293b]">
            {activeTab === "leaves" ? "Leave & Time-Off Management" : "Shift & Attendance Desk"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdminOrHr
              ? "Oversee company-wide shift timestamps and review staff leave applications."
              : "Track your personal shift attendance and manage your time-off applications."}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          {!isAdminOrHr && (
            <>
              <button
                onClick={handlePunchIn}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Punch In</span>
              </button>
              <button
                onClick={handlePunchOut}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-rose-600 hover:bg-rose-700 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-rose-500/20 transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Punch Out</span>
              </button>
            </>
          )}

          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {punchMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border shadow-2xs transition-all duration-300 ${
            punchMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {punchMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{punchMessage.text}</span>
        </div>
      )}

      {/* Segmented Pill Tabs linking to unique URLs */}
      <div className="bg-[#f1f4f9] p-1.5 rounded-2xl flex w-full sm:max-w-md">
        <button
          onClick={() => handleTabSwitch("attendance")}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
            activeTab === "attendance"
              ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Attendance (/attendance)</span>
          <span className="sm:hidden">Attendance</span>
        </button>
        <button
          onClick={() => handleTabSwitch("leaves")}
          className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
            activeTab === "leaves"
              ? "bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Leaves (/leaves)</span>
          <span className="sm:hidden">Leaves</span>
        </button>
      </div>

      {/* Tab 1: Attendance Logs */}
      {activeTab === "attendance" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              {isAdminOrHr ? "Company Attendance Logs" : "Personal Attendance History"} ({attendanceRecords.length})
            </span>
            <button
              onClick={fetchAttendance}
              disabled={loadingAttendance}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loadingAttendance ? "animate-spin text-[#4f46e5]" : ""}`} />
            </button>
          </div>

          {loadingAttendance ? (
            <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-[#4f46e5] border-t-transparent animate-spin"></div>
              <span>Loading attendance history...</span>
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No attendance logs found.
            </div>
          ) : (
            <>
              {/* Mobile Card View (renders as standalone cards on phones) */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {attendanceRecords.map((att) => (
                  <div key={att.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">{att.attendanceDate}</span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                          att.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : att.status === "HALF_DAY"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {att.status}
                      </span>
                    </div>

                    {isAdminOrHr && (
                      <div className="flex items-center justify-between bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100 text-xs">
                        <span className="text-slate-400 font-medium">Employee</span>
                        <span className="font-semibold text-slate-800">
                          {att.employeeName || `Employee #${att.employeeId}`}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Check In</span>
                        <span className="font-mono text-slate-700 font-medium">{formatTime(att.checkIn)}</span>
                      </div>
                      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Check Out</span>
                        <span className="font-mono text-slate-700 font-medium">{formatTime(att.checkOut)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop/Tablet Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="px-4 py-3">Date</th>
                      {isAdminOrHr && <th className="px-4 py-3">Employee</th>}
                      <th className="px-4 py-3">Check In</th>
                      <th className="px-4 py-3">Check Out</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceRecords.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-800">{att.attendanceDate}</td>
                        {isAdminOrHr && (
                          <td className="px-4 py-3 text-slate-700">
                            {att.employeeName || `Employee #${att.employeeId}`}
                          </td>
                        )}
                        <td className="px-4 py-3 font-mono text-slate-600">{formatTime(att.checkIn)}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{formatTime(att.checkOut)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                              att.status === "PRESENT"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : att.status === "HALF_DAY"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab 2: Leaves Management */}
      {activeTab === "leaves" && leaveBalance && leaveBalance.balances && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  Annual Leave Quotas & Balances ({leaveBalance.year})
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isAdminOrHr
                    ? "Admin-controlled annual quota allocation & staff leave utilization"
                    : "Your real-time annual leave entitlement, utilized days, and remaining balance"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAdminOrHr && (
                <>
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={selectedBalanceEmpId || ""}
                      onChange={(e) => handleSelectBalanceEmployee(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="">Viewing: My Account ({user?.name || "Admin"})</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name || `${emp.firstName} ${emp.lastName}`} ({emp.designation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => setIsPolicyModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100/80 text-[#4f46e5] px-3 py-1 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                    title="Configure Annual Quotas"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Set Annual Quotas</span>
                  </button>
                </>
              )}

              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                {leaveBalance.employeeName || "My Profile"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {leaveBalance.balances.map((b) => (
              <div
                key={b.leaveType}
                className="bg-slate-50/70 rounded-xl p-3 border border-slate-100/90 flex flex-col justify-between space-y-1.5 hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {b.leaveType}
                  </span>
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border ${
                      b.leaveType === "UNPAID"
                        ? "bg-slate-100 text-slate-600 border-slate-200"
                        : b.remainingDays > 3
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : b.remainingDays > 0
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {b.leaveType === "UNPAID" ? "Unlimited" : `${b.remainingDays} left`}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {b.leaveType === "UNPAID" ? "∞" : b.remainingDays}
                    {b.leaveType !== "UNPAID" && (
                      <span className="text-[10px] font-medium text-slate-400"> / {b.totalQuota} days</span>
                    )}
                  </div>

                  {b.leaveType !== "UNPAID" && (
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden flex">
                      <div
                        className="bg-[#4f46e5] h-full"
                        style={{
                          width: `${Math.min(100, Math.round((b.usedDays / (b.totalQuota || 1)) * 100))}%`,
                        }}
                        title={`Used: ${b.usedDays} days`}
                      />
                      <div
                        className="bg-amber-400 h-full"
                        style={{
                          width: `${Math.min(100, Math.round((b.pendingDays / (b.totalQuota || 1)) * 100))}%`,
                        }}
                        title={`Pending: ${b.pendingDays} days`}
                      />
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 flex justify-between mt-1">
                    <span>Used: {b.usedDays}d</span>
                    {b.pendingDays > 0 && <span className="text-amber-600 font-medium">({b.pendingDays}d pending)</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Leaves Management */}
      {activeTab === "leaves" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              {isAdminOrHr ? "All Leave Applications" : "My Submitted Leaves"} ({leaves.length})
            </span>
            <button
              onClick={fetchLeaves}
              disabled={loadingLeaves}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loadingLeaves ? "animate-spin text-[#4f46e5]" : ""}`} />
            </button>
          </div>

          {loadingLeaves ? (
            <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-[#4f46e5] border-t-transparent animate-spin"></div>
              <span>Loading leave records...</span>
            </div>
          ) : leaves.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No leave requests found.
            </div>
          ) : (
            <>
              {/* Mobile Card View (renders as standalone cards on phones) */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {leaves.map((leave) => (
                  <div key={leave.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="bg-indigo-50 text-[#4338ca] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 text-[10px]">
                        {leave.leaveType}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                          leave.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : leave.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </div>

                    {isAdminOrHr && (
                      <div className="flex items-center justify-between bg-slate-50/80 px-3 py-2 rounded-xl border border-slate-100 text-xs">
                        <span className="text-slate-400 font-medium">Applicant</span>
                        <span className="font-semibold text-slate-800">
                          {leave.employeeName || `Employee #${leave.employeeId}`}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Start Date</span>
                        <span className="font-medium text-slate-700">{leave.startDate}</span>
                      </div>
                      <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">End Date</span>
                        <span className="font-medium text-slate-700">{leave.endDate}</span>
                      </div>
                    </div>

                    {leave.reason && (
                      <div className="text-xs bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">Reason</span>
                        <p className="text-slate-700 leading-relaxed">{leave.reason}</p>
                      </div>
                    )}

                    {isAdminOrHr && leave.status === "PENDING" && (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleApprove(leave.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(leave.id)}
                          className="flex-1 py-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}

                    {!isAdminOrHr && leave.status === "PENDING" && (
                      <div className="pt-1">
                        <button
                          onClick={() => handleCancel(leave.id)}
                          className="w-full py-2 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-medium transition-colors cursor-pointer text-center"
                        >
                          Cancel Request
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop/Tablet Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="px-4 py-3">Category</th>
                      {isAdminOrHr && <th className="px-4 py-3">Applicant</th>}
                      <th className="px-4 py-3">Start Date</th>
                      <th className="px-4 py-3">End Date</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-[#4338ca]">
                          <span className="bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 text-[10px]">
                            {leave.leaveType}
                          </span>
                        </td>
                        {isAdminOrHr && (
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {leave.employeeName || `Employee #${leave.employeeId}`}
                          </td>
                        )}
                        <td className="px-4 py-3 text-slate-600">{leave.startDate}</td>
                        <td className="px-4 py-3 text-slate-600">{leave.endDate}</td>
                        <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{leave.reason || "–"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                              leave.status === "APPROVED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : leave.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isAdminOrHr && leave.status === "PENDING" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleApprove(leave.id)}
                                className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleReject(leave.id)}
                                className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 font-semibold text-[11px] transition-all cursor-pointer flex items-center gap-1"
                              >
                                <X className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : !isAdminOrHr && leave.status === "PENDING" ? (
                            <button
                              onClick={() => handleCancel(leave.id)}
                              className="px-2.5 py-1 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* Apply Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Apply for Leave</h3>
              </div>
              <button
                onClick={() => setIsLeaveModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs">
              {modalError && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-3.5 text-amber-900 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-bold text-xs text-amber-900">
                      {modalError.toLowerCase().includes('duplicate') ? 'Duplicate Leave Request' : 'Application Notice'}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800 font-medium pl-6">
                    {modalError}
                  </p>
                  <p className="text-[10px] text-amber-700/80 font-normal pl-6">
                    💡 Tip: Please select alternative dates or check your active requests in the Leaves Desk.
                  </p>
                </div>
              )}
              {isAdminOrHr && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">For Employee *</label>
                  <select
                    value={leaveForm.employeeId}
                    onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: Number(e.target.value) })}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all cursor-pointer font-medium"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name || `${emp.firstName} ${emp.lastName}`} ({emp.designation})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-700">Leave Category *</label>
                  {(() => {
                    const b = leaveBalance?.balances.find((item) => item.leaveType === leaveForm.leaveType);
                    if (!b) return null;
                    return (
                      <span className="text-[10px] font-semibold text-[#4f46e5] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {b.leaveType === "UNPAID" ? "Unlimited Available" : `Available: ${b.remainingDays} / ${b.totalQuota} days`}
                      </span>
                    );
                  })()}
                </div>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => { setModalError(null); setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveType }); }}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all cursor-pointer font-medium"
                >
                  <option value="CASUAL">Casual Leave ({policyForm.casualQuota} days annual quota)</option>
                  <option value="SICK">Sick Leave ({policyForm.sickQuota} days annual quota)</option>
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
                    onChange={(e) => { setModalError(null); setLeaveForm({ ...leaveForm, startDate: e.target.value }); }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">End Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => { setModalError(null); setLeaveForm({ ...leaveForm, endDate: e.target.value }); }}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Reason / Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the purpose of this leave..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
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

      {/* Admin Annual Quota Policy Modal */}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
                  <Settings2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Set Annual Leave Quotas</h3>
                  <p className="text-[11px] text-slate-500">Decide company-wide leave entitlements for {policyForm.year}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Policy Year</label>
                <input
                  type="number"
                  disabled
                  value={policyForm.year}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-600 font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Annual Casual Leave Quota (Days) *</label>
                <input
                  type="number"
                  min={0}
                  max={365}
                  required
                  value={policyForm.casualQuota}
                  onChange={(e) => setPolicyForm({ ...policyForm, casualQuota: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default: 12 days per employee per year</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Annual Sick Leave Quota (Days) *</label>
                <input
                  type="number"
                  min={0}
                  max={365}
                  required
                  value={policyForm.sickQuota}
                  onChange={(e) => setPolicyForm({ ...policyForm, sickQuota: Number(e.target.value) })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default: 10 days per employee per year</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 block">Note:</span>
                <p>• Unpaid Leaves remain unlimited for all employees.</p>
                <p>• Updating quotas updates real-time remaining balances for all staff immediately.</p>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPolicyModalOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPolicy}
                  className="rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {savingPolicy ? "Saving Policy..." : "Save Annual Quotas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceLeavePage;
