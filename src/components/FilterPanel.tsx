// interface FilterPanelProps {
//   department: string;
//   setDepartment: React.Dispatch<React.SetStateAction<string>>;
//   status: string;
//   setStatus: React.Dispatch<React.SetStateAction<string>>;
// }

// function FilterPanel({
//   department,
//   setDepartment,
//   status,
//   setStatus,
// }: FilterPanelProps) {
//   return (
//     <div className="filter-panel">
//       <select
//         value={department}
//         onChange={(e) => setDepartment(e.target.value)}
//       >
//         <option value="">All Departments</option>
//         <option value="IT">IT</option>
//         <option value="HR">HR</option>
//         <option value="Finance">Finance</option>
//         <option value="Sales">Sales</option>
//         <option value="Marketing">Marketing</option>
//       </select>

//       <select
//         value={status}
//         onChange={(e) => setStatus(e.target.value)}
//       >
//         <option value="">All Status</option>
//         <option value="Active">Active</option>
//         <option value="Inactive">Inactive</option>
//       </select>
//     </div>
//   );
// }

// export default FilterPanel;




import { useEmployeeContext } from "../context/EmployeeContext";

function FilterPanel() {
  const {
    employees,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
  } = useEmployeeContext();

  const departments = [...new Set(employees.map((emp) => emp.department))];

  return (
    <div className="filter-panel">
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
      >
        <option value="">All Departments</option>

        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}

export default FilterPanel;