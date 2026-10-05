import { useState } from "react";
import { useEmployeeContext } from "../context/EmployeeContext";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import type { Employee } from "../types/api";
import { Plus, RotateCw, AlertCircle } from "lucide-react";

function EmployeeListPage() {
  const {
    employees,
    refreshEmployees,
    loading,
    error,
    statusFilter,
    setStatusFilter
  } = useEmployeeContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const activeCount = employees.filter(e => e.status === 'ACTIVE').length;
  const onLeaveCount = employees.filter(e => e.status === 'ON_LEAVE').length;
  const inactiveCount = employees.filter(e => e.status === 'INACTIVE' || e.status === 'TERMINATED').length;

  const statusTabs = [
    { label: 'All Staff', value: 'all', count: employees.length },
    { label: 'Active', value: 'ACTIVE', count: activeCount },
    { label: 'On Leave', value: 'ON_LEAVE', count: onLeaveCount },
    { label: 'Inactive', value: 'INACTIVE', count: inactiveCount },
  ];

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[#1e293b]">
              Employee Directory
            </h1>
            <span className="rounded-full bg-indigo-50 border border-indigo-100 text-[#4338ca] text-xs font-bold px-2.5 py-0.5">
              {employees.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage company staff members, role allocations, and statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshEmployees()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#4f46e5]' : 'text-slate-500'}`} />
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] hover:from-[#4338ca] hover:to-[#3730a3] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Status Filter Tabs */}
      <div className="bg-[#f1f4f9] p-1.5 rounded-2xl flex flex-wrap gap-1">
        {statusTabs.map((tab) => {
          const isSelected = (statusFilter === '' && tab.value === 'all') || statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value !== 'all' ? tab.value : '')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.2 text-[10px] ${
                  isSelected ? 'bg-indigo-500/80 text-white' : 'bg-white text-slate-600 font-bold border border-slate-200/60'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Advanced Filters */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_4px_20px_rgba(79,70,229,0.03)] flex flex-col md:flex-row gap-3.5">
        <SearchBar />
        <FilterPanel />
      </div>

      {/* Employee List */}
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
