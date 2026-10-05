import api from "./axios";
import type { AuthUser, Department } from "../types/api";

export interface LoginPayload {
  email?: string;
  usernameOrEmail?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  departmentId?: number;
  departmentName?: string;
  phone?: string;
  designation?: string;
}

export const login = async (payload: LoginPayload): Promise<AuthUser> => {
  const email = payload.email || payload.usernameOrEmail || "";
  const res = await api.post("/auth/login", {
    email,
    password: payload.password,
  });
  const data = res.data?.data ?? res.data;
  const token = data.token || data.accessToken || "";
  return {
    ...data,
    token,
    accessToken: token,
    roles: Array.isArray(data.roles) ? data.roles : Array.from(data.roles || []),
  };
};

export const register = async (payload: RegisterPayload): Promise<string> => {
  const res = await api.post("/auth/register", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    departmentId: payload.departmentId,
    departmentName: payload.departmentName,
    phone: payload.phone,
    designation: payload.designation,
  });
  return typeof res.data === "string" ? res.data : (res.data?.data || "User registered successfully");
};

export const getPublicDepartments = async (): Promise<Department[]> => {
  try {
    const res = await api.get("/auth/departments");
    return res.data?.data ?? res.data ?? [];
  } catch {
    try {
      const res = await api.get("/departments");
      return res.data?.data ?? res.data ?? [];
    } catch {
      return [
        { id: 1, name: "IT", description: "Information Technology", status: "ACTIVE" },
        { id: 2, name: "General", description: "General Department", status: "ACTIVE" },
        { id: 3, name: "Sales", description: "Sales & Account Management", status: "ACTIVE" },
        { id: 4, name: "Marketing", description: "Marketing & Communications", status: "ACTIVE" },
      ];
    }
  }
};
