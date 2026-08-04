// import { useEmployeeContext } from "../context/EmployeeContext";

// function FilterPanel() {
//   const {
//     employees,
//     departmentFilter,
//     setDepartmentFilter,
//     statusFilter,
//     setStatusFilter,
//   } = useEmployeeContext();

//   const departments = [...new Set(employees.map((emp) => emp.department))];

//   return (
//     <div className="filter-panel">
//       <select
//         value={departmentFilter}
//         onChange={(e) => setDepartmentFilter(e.target.value)}
//       >
//         <option value="">All Departments</option>

//         {departments.map((department) => (
//           <option key={department} value={department}>
//             {department}
//           </option>
//         ))}
//       </select>

//       <select
//         value={statusFilter}
//         onChange={(e) => setStatusFilter(e.target.value)}
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

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FilterPanel() {
  const {
    employees,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
  } = useEmployeeContext();

  const departments = [
    ...new Set(employees.map((emp) => emp.department)),
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Department Filter */}
      <div className="space-y-2">
        <Label>Department</Label>

        <Select
          value={departmentFilter || "all"}
          onValueChange={(value) =>
            setDepartmentFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Departments
            </SelectItem>

            {departments.map((department) => (
              <SelectItem
                key={department}
                value={department}
              >
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label>Status</Label>

        <Select
          value={statusFilter || "all"}
          onValueChange={(value) =>
            setStatusFilter(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Status
            </SelectItem>

            <SelectItem value="Active">
              Active
            </SelectItem>

            <SelectItem value="Inactive">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default FilterPanel;