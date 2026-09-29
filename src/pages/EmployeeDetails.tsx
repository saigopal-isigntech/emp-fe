import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeById } from "../api/employeeApi";
import { useEmployeeContext } from "../context/EmployeeContext";
import EmployeeForm from "../components/EmployeeForm";
import type { Employee } from "../types/api";

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
      <div className="p-8 text-center text-sm text-slate-500">
        Loading employee details...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center max-w-md mx-auto">
        <h2 className="text-base font-bold text-slate-800">Employee Not Found</h2>
        <button
          onClick={() => navigate("/employees")}
          className="mt-4 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Back to Employees
        </button>
      </div>
    );
  }

  const fullName =
    employee.name ||
    `${employee.firstName || ""} ${employee.lastName || ""}`.trim() ||
    "Employee";

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/employees")}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Back to Employees
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{fullName}</h1>
            <p className="text-xs text-indigo-600 font-semibold">{employee.designation}</p>
          </div>
          <span
            className={`rounded px-2.5 py-0.5 text-xs font-semibold ${
              employee.status === "ACTIVE"
                ? "bg-green-100 text-green-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {employee.status}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div>
            <span className="text-slate-400 block">Employee Code</span>
            <span className="font-semibold text-slate-800">{employee.employeeCode || `EMP-${employee.id}`}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Department</span>
            <span className="font-semibold text-slate-800">
              {employee.department || employee.departmentName || "General"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">Work Email</span>
            <span className="font-semibold text-slate-800">{employee.email}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Phone</span>
            <span className="font-semibold text-slate-800">{employee.phone || employee.mobile || "—"}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Date of Joining</span>
            <span className="font-semibold text-slate-800">{employee.dateOfJoining || "—"}</span>
          </div>

          <div>
            <span className="text-slate-400 block">Annual Salary</span>
            <span className="font-semibold text-slate-800">
              ${Number(employee.salary || 0).toLocaleString()} / yr
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
