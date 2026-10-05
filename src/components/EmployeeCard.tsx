import { useAuth } from "../context/AuthContext";
import React from "react";
import type { Employee } from "../types/api";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";
import { Mail, Phone, DollarSign, Building, Edit3, Trash2, ArrowUpRight, ToggleLeft } from "lucide-react";

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

  const getStatusBadge = () => {
    switch (employee.status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'ON_LEAVE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'TERMINATED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getInitials = () => {
    const parts = fullName.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_4px_20px_rgba(79,70,229,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#4338ca] via-[#4f46e5] to-[#6366f1] text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-500/20 flex-shrink-0">
              {getInitials()}
            </div>
            <div>
              <h3
                onClick={() => navigate(`/employees/${employee.id}`)}
                className="text-sm font-bold text-slate-800 hover:text-[#4f46e5] transition-colors cursor-pointer leading-tight"
              >
                {fullName}
              </h3>
              <p className="text-xs text-[#4f46e5] font-semibold mt-0.5">{employee.designation}</p>
            </div>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border flex-shrink-0 ${getStatusBadge()}`}>
            {employee.status}
          </span>
        </div>

        <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-500 font-semibold">
              {employee.employeeCode || `#${employee.id}`}
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-700 font-medium truncate">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {employee.department || employee.departmentName || "General"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{employee.phone || employee.mobile || "–"}</span>
          </div>

          {employee.salary ? (
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>${Number(employee.salary).toLocaleString()} / yr</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <button
          onClick={handleToggleStatus}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-[#4f46e5] font-medium transition-colors cursor-pointer"
        >
          <ToggleLeft className="w-4 h-4" />
          <span>{employee.status === "ACTIVE" ? "Set Inactive" : "Set Active"}</span>
        </button>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(employee)}
              title="Edit employee"
              className="p-1.5 rounded-xl text-slate-500 hover:text-[#4f46e5] hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleDelete}
              title="Delete employee"
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => navigate(`/employees/${employee.id}`)}
            title="View Details"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;
