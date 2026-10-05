import api from "./axios";
import type { Attendance } from "../types/api";

export const checkIn = async (dateStr?: string): Promise<Attendance> => {
  const attendanceDate = dateStr || new Date().toISOString().split("T")[0];
  const res = await api.post<any>("/attendance/check-in", { attendanceDate });
  return res.data?.data ?? res.data;
};

export const checkOut = async (): Promise<Attendance> => {
  const res = await api.put<any>("/attendance/check-out");
  return res.data?.data ?? res.data;
};

export const getMyAttendance = async (): Promise<Attendance[]> => {
  const res = await api.get<any>("/attendance/my");
  const data = res.data?.data ?? res.data;
  if (!Array.isArray(data)) return [];
  return [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getAttendanceByEmployee = async (employeeId: number): Promise<Attendance[]> => {
  const res = await api.get<any>(`/attendance/employee/${employeeId}`);
  const data = res.data?.data ?? res.data;
  if (!Array.isArray(data)) return [];
  return [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getAttendanceByDate = async (date?: string): Promise<Attendance[]> => {
  const dateParam = date || new Date().toISOString().split("T")[0];
  const res = await api.get<any>(`/attendance/date/${dateParam}`);
  const data = res.data?.data ?? res.data;
  if (!Array.isArray(data)) return [];
  return [...data].sort((a, b) => (b.id || 0) - (a.id || 0));
};

export const getAllAttendance = async (): Promise<Attendance[]> => {
  return getAttendanceByDate();
};
