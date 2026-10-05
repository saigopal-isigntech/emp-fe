import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById } from "../api/employeeApi";
import { useEmployeeContext } from "../context/EmployeeContext";
import type { Employee } from "../types/api";
import EmployeeForm from "../components/EmployeeForm";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Briefcase,
  DollarSign,
  Calendar,
  Edit3,
} from "lucide-react";

function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, refreshEmployees } = useEmployeeContext();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const found = employees.find((e) => e.id === Number(id));
      if (found) {
        setEmployee(found);
        setLoading(false);
      } else {
        try {
          const fetched = await getEmployeeById(Number(id));
          setEmployee(fetched);
        } catch (e) {
          console.error("Failed to load employee details", e);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [id, employees]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-xs font-medium text-slate-500 shadow-xs flex flex-col items-center justify-center gap-2">
        <div className="h-8 w-8 rounded-full border-2 border-[#4f46e5] border-t-transparent animate-spin"></div>
        <span>Loading employee details...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center max-w-md mx-auto shadow-xs">
        <h2 className="text-base font-bold text-slate-800">Employee Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested employee ID does not exist.</p>
        <button
          onClick={() => navigate("/employees")}
          className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </button>
      </div>
    );
  }

  const fullName =
    employee.name ||
    `${employee.firstName || ""} ${employee.lastName || ""}`.trim() ||
    "Employee";

  const getInitials = () => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  };

  const getStatusBadge = () => {
    switch (employee.status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ON_LEAVE":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "TERMINATED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/employees")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employees</span>
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Hero card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_20px_rgba(79,70,229,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#4338ca] via-[#4f46e5] to-[#6366f1] text-white font-bold text-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              {getInitials()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-800">{fullName}</h1>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge()}`}>
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-[#4f46e5] font-semibold mt-0.5">{employee.designation}</p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                ID: {employee.employeeCode || `EMP-${employee.id}`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-5 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#4f46e5]" />
              Department
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {employee.department || employee.departmentName || "General"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#4f46e5]" />
              Designation
            </span>
            <span className="font-bold text-slate-800 text-sm">
              {employee.designation}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#4f46e5]" />
              Annual Salary
            </span>
            <span className="font-bold text-slate-800 text-sm">
              ${Number(employee.salary || 0).toLocaleString()} / yr
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#4f46e5]" />
              Work Email
            </span>
            <span className="font-semibold text-slate-800 truncate block">
              {employee.email}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#4f46e5]" />
              Phone Contact
            </span>
            <span className="font-semibold text-slate-800">
              {employee.phone || employee.mobile || "–"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#4f46e5]" />
              Date of Joining
            </span>
            <span className="font-semibold text-slate-800">
              {employee.dateOfJoining || "–"}
            </span>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EmployeeForm
          employeeToEdit={employee}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            refreshEmployees();
            if (id) {
              getEmployeeById(Number(id)).then(setEmployee).catch(console.warn);
            }
          }}
        />
      )}
    </div>
  );
}

export default EmployeeDetails;
