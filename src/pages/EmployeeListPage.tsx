import { useState } from "react";
import { useEmployeeContext } from "../context/EmployeeContext";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import type { Employee } from "../types/api";

function EmployeeListPage() {
  const { employees, refreshEmployees, loading, error } = useEmployeeContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Employees ({employees.length})
          </h1>
          <p className="text-xs text-slate-500">Manage company staff and profiles.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshEmployees()}
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Add Employee
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col md:flex-row gap-3">
        <SearchBar />
        <FilterPanel />
      </div>

      <EmployeeList
        onEditEmployee={(emp) => setEmployeeToEdit(emp)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {isAddModalOpen && (
        <EmployeeForm
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            refreshEmployees();
          }}
        />
      )}

      {employeeToEdit && (
        <EmployeeForm
          employeeToEdit={employeeToEdit}
          onClose={() => setEmployeeToEdit(null)}
          onSuccess={() => {
            setEmployeeToEdit(null);
            refreshEmployees();
          }}
        />
      )}
    </div>
  );
}

export default EmployeeListPage;
