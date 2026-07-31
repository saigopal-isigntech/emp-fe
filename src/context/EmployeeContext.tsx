import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Employee } from "../types/Employee";
import { useEmployees } from "../hooks/useEmployees";

interface EmployeeContextType {
  employees: Employee[];
  filteredEmployees: Employee[];

  loading: boolean;
  error: string | null;

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  departmentFilter: string;
  setDepartmentFilter: React.Dispatch<React.SetStateAction<string>>;

  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;

  addEmployee: (employee: Employee) => void;
  deleteEmployee: (id: number) => void;
  toggleStatus: (id: number) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export function EmployeeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data, isLoading, error } = useEmployees();

  const [employees, setEmployees] = useState<Employee[]>([]);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data]);

  const addEmployee = (employee: Employee) => {
    setEmployees((prev) => [...prev, employee]);
  };

  const deleteEmployee = (id: number) => {
    setEmployees((prev) =>
      prev.filter((emp) => emp.id !== id)
    );
  };

  const toggleStatus = (id: number) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status:
                emp.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : emp
      )
    );
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchMatch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.id.toString().includes(search);

    const departmentMatch =
      departmentFilter === "" ||
      employee.department === departmentFilter;

    const statusMatch =
      statusFilter === "" ||
      employee.status === statusFilter;

    return searchMatch && departmentMatch && statusMatch;
  });

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        filteredEmployees,

        loading: isLoading,
        error: error ? "Failed to load employees." : null,

        search,
        setSearch,

        departmentFilter,
        setDepartmentFilter,

        statusFilter,
        setStatusFilter,

        addEmployee,
        deleteEmployee,
        toggleStatus,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployeeContext() {
  const context = useContext(EmployeeContext);

  if (!context) {
    throw new Error(
      "useEmployeeContext must be used inside EmployeeProvider"
    );
  }

  return context;
}