import api from "./axios";
import type { PagedResponse, Employee } from "../types/api";

export interface EmployeeQueryParams {
  departmentId?: number;
  status?: string;
  search?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  direction?: "asc" | "desc";
}

export const getAllEmployees = async (params: EmployeeQueryParams = {}): Promise<PagedResponse<Employee>> => {
  const queryKeyword = params.keyword ?? params.search;
  const res = await api.get<any>("/employees", {
    params: {
      keyword: queryKeyword && queryKeyword.trim() !== "" ? queryKeyword.trim() : undefined,
      departmentId: params.departmentId || undefined,
      status: params.status && params.status !== "all" ? params.status : undefined,
      page: params.page ?? 0,
      size: params.size ?? 50,
      sortBy: params.sortBy ?? "id",
      direction: params.direction ?? params.sortDir ?? "asc",
    },
  });
  const data = res.data?.data ?? res.data;
  return {
    ...data,
    content: Array.isArray(data.content) ? data.content.map(normalizeEmployee) : [],
    totalElements: data.totalElements ?? data.content?.length ?? 0,
    totalPages: data.totalPages ?? 1,
    size: data.size ?? 50,
    number: data.number ?? 0,
  };
};

export const getEmployees = async (): Promise<Employee[]> => {
  const paged = await getAllEmployees({ size: 100 });
  return paged.content;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const res = await api.get<any>(`/employees/${id}`);
  const data = res.data?.data ?? res.data;
  return normalizeEmployee(data);
};

export const getMyProfile = async (): Promise<Employee> => {
  const res = await api.get<any>("/employees/me");
  const data = res.data?.data ?? res.data;
  return normalizeEmployee(data);
};

export const createEmployee = async (data: Partial<Employee>): Promise<Employee> => {
  let resolvedUserId = Number(data.userId);
  if (!resolvedUserId || isNaN(resolvedUserId)) {
    try {
      const savedUser = localStorage.getItem("ems_user");
      if (savedUser) {
        resolvedUserId = JSON.parse(savedUser).userId;
      }
    } catch {}
  }
  if (!resolvedUserId || isNaN(resolvedUserId)) {
    resolvedUserId = 1;
  }

  let cleanPhone = (data.phone || data.mobile || "").replace(/\D/g, "");
  if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);
  if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
    cleanPhone = "9876543210";
  }

  const payload = {
    userId: resolvedUserId,
    employeeCode: data.employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    firstName: data.firstName || data.name?.split(" ")[0] || "Employee",
    lastName: data.lastName || data.name?.split(" ").slice(1).join(" ") || "User",
    email: data.email,
    phone: cleanPhone,
    designation: data.designation || "Staff",
    dateOfJoining: data.dateOfJoining || new Date().toISOString().split("T")[0],
    salary: Number(data.salary) > 0 ? Number(data.salary) : 50000,
    departmentId: Number(data.departmentId) || 1,
  };

  const res = await api.post<any>("/employees", payload);
  const responseData = res.data?.data ?? res.data;
  return normalizeEmployee(responseData);
};

export const addEmployee = createEmployee;

export const updateEmployee = async (id: number, data: Partial<Employee>): Promise<Employee> => {
  let cleanPhone = (data.phone || data.mobile || "").replace(/\D/g, "");
  if (cleanPhone.length > 10) cleanPhone = cleanPhone.slice(-10);
  if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
    cleanPhone = "9876543210";
  }

  const payload = {
    userId: Number(data.userId) || 1,
    employeeCode: data.employeeCode || `EMP-${id}`,
    firstName: data.firstName || data.name?.split(" ")[0] || "Employee",
    lastName: data.lastName || data.name?.split(" ").slice(1).join(" ") || "User",
    email: data.email,
    phone: cleanPhone,
    designation: data.designation || "Staff",
    dateOfJoining: data.dateOfJoining || new Date().toISOString().split("T")[0],
    salary: Number(data.salary) > 0 ? Number(data.salary) : 50000,
    departmentId: Number(data.departmentId) || 1,
  };

  const res = await api.put<any>(`/employees/${id}`, payload);
  const responseData = res.data?.data ?? res.data;
  return normalizeEmployee(responseData);
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await api.delete(`/employees/${id}`);
};

export function normalizeEmployee(emp: Employee): Employee {
  if (!emp) return emp;
  const fullName = emp.name || `${emp.firstName || ""} ${emp.lastName || ""}`.trim();
  return {
    ...emp,
    name: fullName || "Unnamed Employee",
    mobile: emp.phone || emp.mobile || "",
    department: emp.departmentName || emp.department || "General",
  };
}
