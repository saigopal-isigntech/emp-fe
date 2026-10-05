import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthUser } from "../types/api";
import { login as loginApi, register as registerApi, type RegisterPayload } from "../api/authApi";

export interface DemoAccount {
  role: "ADMIN" | "HR" | "EMPLOYEE";
  label: string;
  email: string;
  password: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "ADMIN",    label: "Admin",      email: "admin@ems.com",    password: "Admin@123" },
  { role: "HR",       label: "HR Manager", email: "hr@ems.com",       password: "Hr@123" },
  { role: "EMPLOYEE", label: "Employee",   email: "john.doe@ems.com", password: "Password@123" },
];

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentRole: string;
  login: (email: string, pass: string) => Promise<void>;
  register: (payload: RegisterPayload | string, email?: string, pass?: string) => Promise<string>;
  logout: () => void;
  switchDemoRole: (role: "ADMIN" | "HR" | "EMPLOYEE") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("ems_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("ems_token") || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithCredentials = useCallback(async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const authData = await loginApi({ email, password: pass });
      setUser(authData);
      const jwt = authData.token || authData.accessToken || "";
      setToken(jwt);
      localStorage.setItem("ems_token", jwt);
      localStorage.setItem("ems_user", JSON.stringify(authData));
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerUser = useCallback(async (payload: RegisterPayload | string, email?: string, pass?: string): Promise<string> => {
    if (typeof payload === "string") {
      return await registerApi({ name: payload, email: email || "", password: pass || "" });
    }
    return await registerApi(payload);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
  }, []);

  const switchDemoRole = useCallback(async (role: "ADMIN" | "HR" | "EMPLOYEE") => {
    const target = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (target) {
      await loginWithCredentials(target.email, target.password);
    }
  }, [loginWithCredentials]);

  const rawRole = user?.roles?.[0] || "";
  const currentRole = rawRole.replace("ROLE_", "") || (user ? "EMPLOYEE" : "GUEST");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        currentRole,
        login: loginWithCredentials,
        register: registerUser,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
