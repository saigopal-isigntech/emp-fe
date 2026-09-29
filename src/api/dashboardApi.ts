import api from "./axios";
import type { DashboardSummary } from "../types/api";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await api.get<any>("/dashboard");
  const data = res.data?.data ?? res.data;
  return {
    totalEmployees: data.totalEmployees ?? 0,
    activeEmployees: data.activeEmployees ?? 0,
    inactiveEmployees: data.inactiveEmployees ?? 0,
    totalDepartments: data.totalDepartments ?? 0,
    presentToday: data.presentToday ?? 0,
    absentToday: data.absentToday ?? 0,
    halfDayToday: data.halfDayToday ?? 0,
    pendingLeaveRequests: data.pendingLeaveRequests ?? 0,
    approvedLeaveRequests: data.approvedLeaveRequests ?? 0,
    rejectedLeaveRequests: data.rejectedLeaveRequests ?? 0,
    pendingLeaves: data.pendingLeaveRequests ?? 0,
    employeesOnLeave: (data.absentToday ?? 0) + (data.halfDayToday ?? 0),
  };
};
