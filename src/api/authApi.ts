import api from "./axios";
import type { AuthUser } from "../types/api";

export interface LoginPayload {
  email?: string;
  usernameOrEmail?: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
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
  });
  return typeof res.data === "string" ? res.data : (res.data?.data || "User registered successfully");
};
