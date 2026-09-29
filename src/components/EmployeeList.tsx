import { useState } from "react";
import EmployeeCard from "./EmployeeCard";
import { useEmployeeContext } from "../context/EmployeeContext";
import { useAuth } from "../context/AuthContext";
import type { Employee } from "../types/api";
import { useNavigate } from "react-router-dom";

interface EmployeeListProps {
  onEditEmployee?: (employee: Employee) => void;
  onOpenAddModal?: () => void;
}

function EmployeeList({ onEditEmployee, onOpenAddModal }: EmployeeListProps) {
  const { filteredEmployees, employees, loading, deleteEmployee, toggleStatus } = useEmployeeContext();
  const { currentRole } = useAuth();
  const isAdmin = currentRole === "ADMIN";
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  if (loading && employees.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Loading employee records...
      </div>
    );
  }

  if (filteredEmployees.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-slate-700">No employees found</p>
        <p className="text-xs text-slate-500 mt-1">Try changing your search query or filters.</p>
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="mt-3 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Add Employee
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing {filteredEmployees.length} of {employees.length} employees
        </span>

        <div className="flex gap-1 border border-slate-200 rounded-lg p-0.5 bg-white">
          <button
            onClick={() => setViewMode("table")}
            className={`px-2.5 py-1 rounded text-xs ${
              viewMode === "table" ? "bg-slate-800 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`px-2.5 py-1 rounded text-xs ${
              viewMode === "cards" ? "bg-slate-800 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Cards
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
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => {
                  const fullName =
                    emp.name ||
                    `${emp.firstName || ""} ${emp.lastName || ""}`.trim() ||
                    "Employee";

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-slate-500">
                        {emp.employeeCode || `#${emp.id}`}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        <button
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          className="hover:text-indigo-600 text-left"
                        >
                          {fullName}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {emp.department || emp.departmentName || "General"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{emp.designation}</td>
                      <td className="px-4 py-3 text-slate-600">{emp.email}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => emp.id && toggleStatus(emp.id)}
                          className="cursor-pointer"
                        >
                          <span
                            className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                              emp.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : emp.status === "ON_LEAVE"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {onEditEmployee && (
                          <button
                            onClick={() => onEditEmployee(emp)}
                            className="text-indigo-600 hover:underline font-medium"
                          >
                            Edit
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() =>
                              emp.id &&
                              window.confirm(`Delete employee "${fullName}"?`) &&
                              deleteEmployee(emp.id)
                            }
                            className="text-red-600 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/employees/${emp.id}`)}
                          className="text-slate-600 hover:underline font-medium"
                        >
                          View
                        </button>
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
