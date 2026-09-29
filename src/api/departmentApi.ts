import api from "./axios";
import type { Department, Employee } from "../types/api";
import { normalizeEmployee } from "./employeeApi";

export interface DepartmentPayload {
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
}

export const getDepartments = async (): Promise<Department[]> => {
  const res = await api.get<any>("/departments");
  const data = res.data?.data ?? res.data;
  return Array.isArray(data) ? data : [];
};

export const getDepartmentById = async (id: number): Promise<Department> => {
  const res = await api.get<any>(`/departments/${id}`);
  return res.data?.data ?? res.data;
};

export const createDepartment = async (payload: DepartmentPayload): Promise<Department> => {
  const res = await api.post<any>("/departments", payload);
  return res.data?.data ?? res.data;
};

export const updateDepartment = async (id: number, payload: DepartmentPayload): Promise<Department> => {
  const res = await api.put<any>(`/departments/${id}`, payload);
  return res.data?.data ?? res.data;
};

export const deleteDepartment = async (id: number): Promise<void> => {
  await api.delete(`/departments/${id}`);
};

export const getDepartmentEmployees = async (id: number): Promise<Employee[]> => {
  const res = await api.get<any>(`/departments/${id}/employees`);
  const data = res.data?.data ?? res.data;
  return Array.isArray(data) ? data.map(normalizeEmployee) : [];
};
