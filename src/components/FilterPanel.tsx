import { useEmployeeContext } from "../context/EmployeeContext";

function FilterPanel() {
  const {
    departments,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
  } = useEmployeeContext();

  return (
    <div className="flex gap-3 flex-1">
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Department
        </label>
        <select
          value={departmentFilter || "all"}
          onChange={(e) => setDepartmentFilter(e.target.value !== "all" ? e.target.value : "")}
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white outline-none focus:border-indigo-500"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-600 mb-1">
          Status
        </label>
        <select
          value={statusFilter || "all"}
          onChange={(e) => setStatusFilter(e.target.value !== "all" ? e.target.value : "")}
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white outline-none focus:border-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ON_LEAVE">On Leave</option>
          <option value="TERMINATED">Terminated</option>
        </select>
      </div>
    </div>
  );
}

export default FilterPanel;
