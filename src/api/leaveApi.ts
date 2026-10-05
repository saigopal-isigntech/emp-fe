import api from "./axios";
import type { LeaveRequest, LeaveType, LeaveStatus, LeaveBalanceResponse, LeavePolicy } from "../types/api";

export interface ApplyLeavePayload {
  employeeId?: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export const applyLeave = async (payload: ApplyLeavePayload): Promise<LeaveRequest> => {
  let resolvedEmpId = payload.employeeId;
  if (!resolvedEmpId) {
    try {
      const savedUser = localStorage.getItem("ems_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        resolvedEmpId = u.employeeId;
      }
    } catch {}
  }

  const res = await api.post<any>("/leaves", {
    employeeId: resolvedEmpId,
    leaveType: payload.leaveType,
    startDate: payload.startDate,
    endDate: payload.endDate,
    reason: payload.reason,
  });
  return res.data?.data ?? res.data;
};

export const getMyLeaves = async (employeeId?: number): Promise<LeaveRequest[]> => {
  let resolvedEmpId = employeeId;
  if (!resolvedEmpId) {
    try {
      const savedUser = localStorage.getItem("ems_user");
      if (savedUser) {
        resolvedEmpId = JSON.parse(savedUser).employeeId || JSON.parse(savedUser).userId;
      }
    } catch {}
  }
  if (!resolvedEmpId) resolvedEmpId = 1;

  const res = await api.get<any>(`/leaves/employee/${resolvedEmpId}`);
  const data = res.data?.data ?? res.data;
  if (!Array.isArray(data)) return [];
  return [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getLeavesByEmployee = async (employeeId: number): Promise<LeaveRequest[]> => {
  const res = await api.get<any>(`/leaves/employee/${employeeId}`);
  const data = res.data?.data ?? res.data;
  if (!Array.isArray(data)) return [];
  return [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getAllLeaves = async (): Promise<LeaveRequest[]> => {
  const res = await api.get<any>("/leaves");
  const data = res.data?.data ?? res.data;
  if (!Array.isArray(data)) return [];
  return [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getLeavesByStatus = async (status: LeaveStatus): Promise<LeaveRequest[]> => {
  const res = await api.get<any>(`/leaves/status/${status}`);
  const data = res.data?.data ?? res.data;
  return Array.isArray(data) ? data : [];
};

export const getLeaveById = async (id: number): Promise<LeaveRequest> => {
  const res = await api.get<any>(`/leaves/${id}`);
  return res.data?.data ?? res.data;
};

export const cancelLeave = async (id: number): Promise<LeaveRequest> => {
  const res = await api.put<any>(`/leaves/${id}/cancel`);
  return res.data?.data ?? res.data;
};

export const approveLeave = async (id: number): Promise<LeaveRequest> => {
  const res = await api.put<any>(`/leaves/${id}/approve`);
  return res.data?.data ?? res.data;
};

export const rejectLeave = async (id: number, reason: string): Promise<LeaveRequest> => {
  const res = await api.put<any>(`/leaves/${id}/reject`, null, {
    params: {
      rejectionReason: reason || "Rejected by reviewer",
    },
  });
  return res.data?.data ?? res.data;
};

export const getMyLeaveBalance = async (year?: number): Promise<LeaveBalanceResponse | null> => {
  try {
    const res = await api.get<any>("/leaves/balance/my", { params: { year } });
    return res.data?.data ?? res.data;
  } catch {
    return null;
  }
};

export const getLeaveBalanceByEmployee = async (employeeId: number, year?: number): Promise<LeaveBalanceResponse | null> => {
  try {
    const res = await api.get<any>(`/leaves/balance/${employeeId}`, { params: { year } });
    return res.data?.data ?? res.data;
  } catch {
    return null;
  }
};

export const getLeavePolicy = async (year?: number): Promise<LeavePolicy | null> => {
  try {
    const res = await api.get<any>("/leaves/policy", { params: { year } });
    return res.data?.data ?? res.data;
  } catch {
    return null;
  }
};

export const updateLeavePolicy = async (payload: LeavePolicy): Promise<LeavePolicy> => {
  const res = await api.put<any>("/leaves/policy", payload);
  return res.data?.data ?? res.data;
};
