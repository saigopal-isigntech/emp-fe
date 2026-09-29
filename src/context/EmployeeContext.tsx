import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Employee, Department } from "../types/api";
import {
  getAllEmployees,
  createEmployee as createEmployeeApi,
  updateEmployee as updateEmployeeApi,
  deleteEmployee as deleteEmployeeApi,
  normalizeEmployee,
} from "../api/employeeApi";
import { getDepartments } from "../api/departmentApi";
import { useAuth } from "./AuthContext";

interface EmployeeContextType {
  employees: Employee[];
  filteredEmployees: Employee[];
  departments: Department[];
  loading: boolean;
  error: string | null;

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  departmentFilter: string;
  setDepartmentFilter: React.Dispatch<React.SetStateAction<string>>;

  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;

  addEmployee: (employee: Partial<Employee>) => Promise<Employee>;
  editEmployee: (id: number, employee: Partial<Employee>) => Promise<Employee>;
  deleteEmployee: (id: number) => Promise<void>;
  toggleStatus: (id: number) => Promise<void>;
  refreshEmployees: () => Promise<void>;
  refreshDepartments: () => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const refreshEmployees = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const paged = await getAllEmployees({ size: 100 });
      setEmployees(Array.isArray(paged.content) ? paged.content.map(normalizeEmployee) : []);
    } catch (err: any) {
      console.error("Failed to load employees", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to load employees from backend.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshDepartments = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const depts = await getDepartments();
      setDepartments(depts);
    } catch (err) {
      console.warn("Failed to load departments", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshEmployees();
      refreshDepartments();
    }
  }, [isAuthenticated, refreshEmployees, refreshDepartments]);

  const addEmployee = async (employeeData: Partial<Employee>): Promise<Employee> => {
    const created = await createEmployeeApi(employeeData);
    setEmployees((prev) => [created, ...prev]);
    return created;
  };

  const editEmployee = async (id: number, employeeData: Partial<Employee>): Promise<Employee> => {
    const updated = await updateEmployeeApi(id, employeeData);
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? updated : emp)));
    return updated;
  };

  const deleteEmployee = async (id: number) => {
    await deleteEmployeeApi(id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const toggleStatus = async (id: number) => {
    const target = employees.find((emp) => emp.id === id);
    if (!target) return;

    const nextStatus = target.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const updated = await updateEmployeeApi(id, {
        ...target,
        status: nextStatus,
      });
      setEmployees((prev) => prev.map((emp) => (emp.id === id ? updated : emp)));
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const term = search.toLowerCase().trim();
    const fullName = `${employee.firstName || ""} ${employee.lastName || ""}`.toLowerCase();
    const searchMatch =
      !term ||
      employee.name?.toLowerCase().includes(term) ||
      fullName.includes(term) ||
      employee.email.toLowerCase().includes(term) ||
      employee.employeeCode?.toLowerCase().includes(term) ||
      (employee.id?.toString() ?? "").includes(term);

    const departmentMatch =
      departmentFilter === "" ||
      departmentFilter === "all" ||
      employee.department === departmentFilter ||
      employee.departmentName === departmentFilter ||
      employee.departmentId?.toString() === departmentFilter;

    const statusMatch =
      statusFilter === "" ||
      statusFilter === "all" ||
      (employee.status || "").toUpperCase() === statusFilter.toUpperCase();

    return searchMatch && departmentMatch && statusMatch;
  });

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        filteredEmployees,
        departments,
        loading,
        error,
        search,
        setSearch,
        departmentFilter,
        setDepartmentFilter,
        statusFilter,
        setStatusFilter,
        addEmployee,
        editEmployee,
        deleteEmployee,
        toggleStatus,
        refreshEmployees,
        refreshDepartments,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext() {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployeeContext must be used inside EmployeeProvider");
  }
  return context;
}
