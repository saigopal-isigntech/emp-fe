import { useAuth } from "../context/AuthContext";
import React from "react";
import type { Employee } from "../types/api";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
}

function EmployeeCard({ employee, onEdit }: EmployeeCardProps) {
  const navigate = useNavigate();
  const { deleteEmployee, toggleStatus } = useEmployeeContext();
  const { currentRole } = useAuth();
  const isAdmin = currentRole === "ADMIN";

  const fullName =
    employee.name ||
    `${employee.firstName || ""} ${employee.lastName || ""}`.trim() ||
    "Employee";

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (employee.id && window.confirm(`Delete employee "${fullName}"?`)) {
      deleteEmployee(employee.id);
    }
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (employee.id) {
      toggleStatus(employee.id);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h3
              onClick={() => navigate(`/employees/${employee.id}`)}
              className="text-base font-bold text-slate-800 hover:text-indigo-600 cursor-pointer"
            >
              {fullName}
            </h3>
            <p className="text-xs text-indigo-600 font-medium">{employee.designation}</p>
          </div>
          <span
            className={`rounded px-2 py-0.5 text-xs font-semibold ${
              employee.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : employee.status === "ON_LEAVE"
                ? "bg-amber-100 text-amber-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {employee.status}
          </span>
        </div>

        <div className="mt-3 space-y-1 text-xs text-slate-600">
          <p><span className="text-slate-400">Code:</span> {employee.employeeCode || `#${employee.id}`}</p>
          <p><span className="text-slate-400">Dept:</span> {employee.department || employee.departmentName || "General"}</p>
          <p><span className="text-slate-400">Email:</span> {employee.email}</p>
          <p><span className="text-slate-400">Phone:</span> {employee.phone || employee.mobile || "—"}</p>
          {employee.salary && (
            <p><span className="text-slate-400">Salary:</span> ${Number(employee.salary).toLocaleString()}/yr</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <button
          onClick={handleToggleStatus}
          className="text-slate-600 hover:text-slate-900 font-medium"
        >
          {employee.status === "ACTIVE" ? "Set Inactive" : "Set Active"}
        </button>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(employee)}
              className="text-indigo-600 hover:underline font-medium"
            >
              Edit
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:underline font-medium"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => navigate(`/employees/${employee.id}`)}
            className="text-slate-700 hover:underline font-medium"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;
