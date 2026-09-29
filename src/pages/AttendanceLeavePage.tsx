import React, { useState, useEffect } from "react";
import { checkIn, checkOut, getAllAttendance, getMyAttendance } from "../api/attendanceApi";
import { getAllLeaves, getMyLeaves, applyLeave, approveLeave, rejectLeave, cancelLeave } from "../api/leaveApi";
import { useAuth } from "../context/AuthContext";
import { useEmployeeContext } from "../context/EmployeeContext";
import type { Attendance, LeaveRequest, LeaveType } from "../types/api";

function AttendanceLeavePage() {
  const { currentRole, user } = useAuth();
  const { employees } = useEmployeeContext();
  const [activeTab, setActiveTab] = useState<"attendance" | "leaves">("attendance");

  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [punchMessage, setPunchMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    employeeId: 1,
    leaveType: "CASUAL" as LeaveType,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
  });

  const isAdminOrHr = currentRole === "ADMIN" || currentRole === "HR";

  useEffect(() => {
    fetchAttendance();
    fetchLeaves();
  }, [currentRole]);

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

  const fetchLeaves = async () => {
    setLoadingLeaves(true);
    try {
      if (isAdminOrHr) {
        const data = await getAllLeaves();
        setLeaves(data || []);
      } else {
        const data = await getMyLeaves();
        setLeaves(data || []);
      }
    } catch {
      setLeaves([]);
    } finally {
      setLoadingLeaves(false);
    }
  };

  const handlePunchIn = async () => {
    try {
      await checkIn();
      setPunchMessage({ type: "success", text: "Successfully checked in." });
      fetchAttendance();
    } catch (err: any) {
      setPunchMessage({ type: "error", text: err?.response?.data?.message || "Punch in failed." });
    }
  };

  const handlePunchOut = async () => {
    try {
      await checkOut();
      setPunchMessage({ type: "success", text: "Successfully checked out." });
      fetchAttendance();
    } catch (err: any) {
      setPunchMessage({ type: "error", text: err?.response?.data?.message || "Punch out failed." });
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await applyLeave({ ...leaveForm, employeeId: user?.employeeId || leaveForm.employeeId });
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
      alert(err?.response?.data?.message || "Failed to submit leave request.");
    }
  };

  const handleApproveLeave = async (id?: number) => {
    if (!id) return;
    try {
      await approveLeave(id);
      fetchLeaves();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to approve leave.");
    }
  };

  const handleRejectLeave = async (id?: number) => {
    if (!id) return;
    try {
      await rejectLeave(id, "Rejected by reviewer");
      fetchLeaves();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to reject leave.");
    }
  };

  const handleCancelLeave = async (id?: number) => {
    if (!id) return;
    try {
      await cancelLeave(id);
      fetchLeaves();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel leave.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Attendance & Leaves
          </h1>
          <p className="text-xs text-slate-500">Track check-ins and process leave applications.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePunchIn}
            className="rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
          >
            Punch In
          </button>
          <button
            onClick={handlePunchOut}
            className="rounded-lg bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
          >
            Punch Out
          </button>
        </div>
      </div>

      {punchMessage && (
        <div
          className={`p-3 rounded-lg text-xs font-medium ${
            punchMessage.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {punchMessage.text}
        </div>
      )}

      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${
            activeTab === "attendance"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Attendance Log ({attendanceRecords.length})
        </button>
        <button
          onClick={() => setActiveTab("leaves")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${
            activeTab === "leaves"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Leave Requests ({leaves.length})
        </button>
      </div>

      {activeTab === "attendance" && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="px-4 py-3">Staff</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Punch In</th>
                  <th className="px-4 py-3">Punch Out</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingAttendance ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      Loading attendance...
                    </td>
                  </tr>
                ) : attendanceRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendanceRecords.map((att, index) => (
                    <tr key={att.id || index} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {att.employeeName || `Staff #${att.employeeId || index + 1}`}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{att.attendanceDate || "Today"}</td>
                      <td className="px-4 py-3 text-green-700 font-medium">{att.checkIn || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{att.checkOut || "—"}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {att.workingHours ? `${att.workingHours} hrs` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-800">
                          {att.status || "PRESENT"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "leaves" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Apply for Leave
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="px-4 py-3">Staff</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Dates</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingLeaves ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                        Loading leave requests...
                      </td>
                    </tr>
                  ) : leaves.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                        No leave applications found.
                      </td>
                    </tr>
                  ) : (
                    leaves.map((leave, index) => (
                      <tr key={leave.id || index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {leave.employeeName || (leave.employeeId ? `Employee #${leave.employeeId}` : "Staff")}
                        </td>
                        <td className="px-4 py-3 text-indigo-700 font-semibold">{leave.leaveType}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {leave.startDate} to {leave.endDate}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{leave.reason || "—"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                              leave.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : leave.status === "PENDING"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {isAdminOrHr && leave.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApproveLeave(leave.id)}
                                className="text-green-700 hover:underline font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectLeave(leave.id)}
                                className="text-red-600 hover:underline font-semibold"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {!isAdminOrHr && leave.status === "PENDING" && (
                            <button
                              onClick={() => handleCancelLeave(leave.id)}
                              className="text-slate-600 hover:underline font-semibold"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800">Apply for Leave</h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="p-5 space-y-3 text-xs">
              {isAdminOrHr && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Select Employee *</label>
                  <select
                    value={leaveForm.employeeId}
                    onChange={(e) => setLeaveForm({ ...leaveForm, employeeId: Number(e.target.value) })}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 outline-none focus:border-indigo-500"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.designation})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 mb-1">Leave Type *</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveType })}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 outline-none focus:border-indigo-500"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Reason *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Reason for leave..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full rounded border border-slate-300 p-2 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Submit
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
