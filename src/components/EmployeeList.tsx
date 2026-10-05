import { useState } from "react";
import { useEmployeeContext } from "../context/EmployeeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EmployeeCard from "./EmployeeCard";
import type { Employee } from "../types/api";
import {
  LayoutGrid,
  Table,
  Eye,
  Edit3,
  Trash2,
  Users,
  UserPlus,
} from "lucide-react";

interface EmployeeListProps {
  onEditEmployee?: (employee: Employee) => void;
  onOpenAddModal?: () => void;
}

function EmployeeList({ onEditEmployee, onOpenAddModal }: EmployeeListProps) {
  const { filteredEmployees, employees, loading, toggleStatus, deleteEmployee } =
    useEmployeeContext();
  const { currentRole } = useAuth();
  const isAdmin = currentRole === "ADMIN";
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-xs font-medium text-slate-500 shadow-xs flex flex-col items-center justify-center gap-2">
        <div className="h-8 w-8 rounded-full border-2 border-[#4f46e5] border-t-transparent animate-spin"></div>
        <span>Loading workforce directory...</span>
      </div>
    );
  }

  if (filteredEmployees.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4f46e5]">
          <Users className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-bold text-slate-800">No employees match your search</h3>
        <p className="mt-1 text-xs text-slate-500">
          Try resetting your department or status filter parameters.
        </p>
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add New Employee</span>
          </button>
        )}
      </div>
    );
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      case "ON_LEAVE":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      case "TERMINATED":
        return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200";
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong className="text-slate-800">{filteredEmployees.length}</strong> of{" "}
          <strong className="text-slate-800">{employees.length}</strong> employees
        </span>

        <div className="flex gap-1 border border-slate-200/80 rounded-2xl p-1 bg-white shadow-2xs">
          <button
            onClick={() => setViewMode("table")}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-[#4f46e5] text-white font-semibold shadow-2xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              viewMode === "cards"
                ? "bg-[#4f46e5] text-white font-semibold shadow-2xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onEdit={onEditEmployee} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Employee Name</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Designation</th>
                  <th className="px-4 py-3.5">Contact Email</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const fullName =
                    emp.name ||
                    `${emp.firstName || ""} ${emp.lastName || ""}`.trim() ||
                    "Employee";

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-4 py-3.5 font-mono text-slate-500 text-[11px]">
                        <span className="bg-slate-100 px-2 py-1 rounded-lg border border-slate-200/60">
                          {emp.employeeCode || `#${emp.id}`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-xl bg-indigo-50 border border-indigo-100 text-[#4f46e5] font-bold flex items-center justify-center text-[10px]">
                            {getInitials(fullName)}
                          </div>
                          <button
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            className="hover:text-[#4f46e5] text-left font-semibold cursor-pointer transition-colors"
                          >
                            {fullName}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4338ca] text-[11px] font-medium border border-indigo-100">
                          {emp.department || emp.departmentName || "General"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-medium">{emp.designation}</td>
                      <td className="px-4 py-3.5 text-slate-500">{emp.email}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => emp.id && toggleStatus(emp.id)}
                          title="Click to toggle status"
                          className="cursor-pointer"
                        >
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition-colors ${getStatusBadge(
                              emp.status
                            )}`}
                          >
                            {emp.status}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            title="View Profile"
                            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {onEditEmployee && (
                            <button
                              onClick={() => onEditEmployee(emp)}
                              title="Edit Employee"
                              className="p-1.5 rounded-xl text-slate-500 hover:text-[#4f46e5] hover:bg-indigo-50 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() =>
                                emp.id &&
                                window.confirm(`Delete employee "${fullName}"?`) &&
                                deleteEmployee(emp.id)
                              }
                              title="Delete Employee"
                              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default EmployeeList;
