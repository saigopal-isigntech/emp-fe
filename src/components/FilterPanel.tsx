import { useEmployeeContext } from "../context/EmployeeContext";
import { Building2, X } from "lucide-react";

function FilterPanel() {
  const {
    departments,
    departmentFilter,
    setDepartmentFilter,
  } = useEmployeeContext();

  return (
    <div className="flex gap-3 flex-1">
      <div className="flex-1">
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#4f46e5]" />
          <span>Filter by Department</span>
        </label>
        <div className="relative flex items-center">
          <select
            value={departmentFilter || "all"}
            onChange={(e) => setDepartmentFilter(e.target.value !== "all" ? e.target.value : "")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-4 focus:ring-indigo-500/15 transition-all cursor-pointer font-medium"
          >
            <option value="all">All Departments ({departments.length})</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
          {departmentFilter && (
            <button
              onClick={() => setDepartmentFilter("")}
              title="Reset department filter"
              className="absolute right-8 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
