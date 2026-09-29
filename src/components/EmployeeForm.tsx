import { useState, useEffect } from "react";
import { useEmployeeContext } from "../context/EmployeeContext";
import type { Employee } from "../types/api";

interface EmployeeFormProps {
  employeeToEdit?: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

function EmployeeForm({ employeeToEdit, onClose, onSuccess }: EmployeeFormProps) {
  const { addEmployee, editEmployee, departments } = useEmployeeContext();
  const isEditing = Boolean(employeeToEdit);

  const [formData, setFormData] = useState({
    userId: 1,
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    departmentId: departments[0]?.id || 1,
    salary: "",
    dateOfJoining: new Date().toISOString().split("T")[0],
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      const parts = (employeeToEdit.name || "").split(" ");
      const fName = employeeToEdit.firstName || parts[0] || "";
      const lName = employeeToEdit.lastName || parts.slice(1).join(" ") || "";

      let matchedDeptId = departments[0]?.id || 1;
      if (employeeToEdit.departmentId) {
        matchedDeptId = employeeToEdit.departmentId;
      } else if (employeeToEdit.department || employeeToEdit.departmentName) {
        const found = departments.find(
          (d) => d.name === (employeeToEdit.department || employeeToEdit.departmentName)
        );
        if (found) matchedDeptId = found.id;
      }

      setFormData({
        userId: employeeToEdit.userId || 1,
        employeeCode: employeeToEdit.employeeCode || `EMP-${employeeToEdit.id || 1001}`,
        firstName: fName,
        lastName: lName,
        email: employeeToEdit.email || "",
        phone: employeeToEdit.phone || employeeToEdit.mobile || "",
        designation: employeeToEdit.designation || "",
        departmentId: matchedDeptId,
        salary: employeeToEdit.salary ? String(employeeToEdit.salary) : "",
        dateOfJoining: employeeToEdit.dateOfJoining
          ? employeeToEdit.dateOfJoining.split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: employeeToEdit.status || "ACTIVE",
      });
    } else if (departments.length > 0) {
      setFormData((prev) => ({ ...prev, departmentId: departments[0].id }));
    }
  }, [employeeToEdit, departments]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "departmentId" || name === "userId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = formData.phone.trim();
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg("Phone number must be exactly 10 digits starting with 6, 7, 8, or 9.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        userId: Number(formData.userId),
        employeeCode: formData.employeeCode.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        phone: cleanPhone,
        mobile: cleanPhone,
        designation: formData.designation.trim(),
        departmentId: Number(formData.departmentId),
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
        "Failed to save employee.";
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-lg border border-slate-200 overflow-hidden my-6">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Auth User ID *</label>
              <input
                type="number"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                min="1"
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Employee Code *</label>
              <input
                type="text"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
                placeholder="EMP-1002"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Work Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Phone Number (10 digits) *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={10}
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Designation *</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Department *</label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 bg-white outline-none focus:border-indigo-500"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Salary ($) *</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Date of Joining *</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-slate-700 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-300 px-3 py-1.5 bg-white outline-none focus:border-indigo-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
