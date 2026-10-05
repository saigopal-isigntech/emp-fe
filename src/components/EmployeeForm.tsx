import React, { useState } from "react";
import { useEmployeeContext } from "../context/EmployeeContext";
import type { Employee } from "../types/api";
import { UserCheck, X, AlertCircle } from "lucide-react";

interface EmployeeFormProps {
  employeeToEdit?: Employee;
  onClose: () => void;
  onSuccess: () => void;
}

function EmployeeForm({ employeeToEdit, onClose, onSuccess }: EmployeeFormProps) {
  const { addEmployee, editEmployee, departments } = useEmployeeContext();
  const isEditing = Boolean(employeeToEdit);

  const [formData, setFormData] = useState({
    userId: employeeToEdit?.userId || 1,
    employeeCode: employeeToEdit?.employeeCode || "",
    firstName: employeeToEdit?.firstName || employeeToEdit?.name?.split(" ")[0] || "",
    lastName:
      employeeToEdit?.lastName ||
      (employeeToEdit?.name ? employeeToEdit.name.split(" ").slice(1).join(" ") : "") ||
      "",
    email: employeeToEdit?.email || "",
    phone: employeeToEdit?.phone || employeeToEdit?.mobile || "",
    designation: employeeToEdit?.designation || "",
    departmentId: employeeToEdit?.departmentId || (departments[0]?.id ?? 1),
    salary: employeeToEdit?.salary || 50000,
    dateOfJoining: employeeToEdit?.dateOfJoining || new Date().toISOString().split("T")[0],
    status: (employeeToEdit?.status as "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED") || "ACTIVE",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "departmentId" || name === "userId"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const payload: Partial<Employee> = {
        userId: formData.userId,
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        mobile: formData.phone,
        designation: formData.designation,
        departmentId: formData.departmentId,
        salary: Number(formData.salary) || 0,
        dateOfJoining: formData.dateOfJoining,
        status: formData.status,
      };

      if (isEditing && employeeToEdit?.id) {
        await editEmployee(employeeToEdit.id, payload);
      } else {
        await addEmployee(payload);
      }
      onSuccess();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "An unexpected error occurred while saving.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 shrink-0 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4f46e5]">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">
                {isEditing ? "Update Employee Profile" : "Register New Employee"}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                {isEditing ? "Modify staff allocations and credentials" : "Create new corporate record and department assignment"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs">
          {errorMsg && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">First Name *</label>
              <input
                type="text"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Leon"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Last Name *</label>
              <input
                type="text"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Vance"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Work Email Address *</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="leon@gmail.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Phone Contact</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Department *</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all cursor-pointer font-medium"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Designation / Role *</label>
              <input
                type="text"
                required
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Software Engineer"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Annual Salary ($)</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="55000"
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Employment Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:ring-4 focus:ring-indigo-500/15 transition-all cursor-pointer font-medium"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-3 sm:pt-4 border-t border-slate-100 bg-white shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer text-center"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
