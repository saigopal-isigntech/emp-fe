// import type { Employee } from "../App";
// import DashboardHeader from "../components/DashboardHeader";
// import SearchBar from "../components/SearchBar";
// import FilterPanel from "../components/FilterPanel";
// import EmployeeForm from "../components/EmployeeForm";
// import EmployeeList from "../components/EmployeeList";

// interface DashboardProps {
//   employees: Employee[];
//   totalEmployees: number;
//   addEmployee: (employee: Employee) => void;
//   deleteEmployee: (id: number) => void;
//   toggleStatus: (id: number) => void;

//   search: string;
//   setSearch: (value: string) => void;

//   departmentFilter: string;
//   setDepartmentFilter: (value: string) => void;

//   statusFilter: string;
//   setStatusFilter: (value: string) => void;
// }

// function Dashboard({
//   employees,
//   totalEmployees,
//   addEmployee,
//   deleteEmployee,
//   toggleStatus,
//   search,
//   setSearch,
//   departmentFilter,
//   setDepartmentFilter,
//   statusFilter,
//   setStatusFilter,
// }: DashboardProps) {
//   return (
//     <main className="dashboard">
//       <DashboardHeader totalEmployees={totalEmployees} />

//       <SearchBar
//         search={search}
//         setSearch={setSearch}
//       />

//       <FilterPanel
//         department={departmentFilter}
//         setDepartment={setDepartmentFilter}
//         status={statusFilter}
//         setStatus={setStatusFilter}
//       />

//       <EmployeeForm
//         addEmployee={addEmployee}
//       />

//       <EmployeeList
//         employees={employees}
//         deleteEmployee={deleteEmployee}
//         toggleStatus={toggleStatus}
//       />
//     </main>
//   );
// }

// export default Dashboard;


// import type { Employee } from "../App";
// import DashboardHeader from "../components/DashboardHeader";
// import SearchBar from "../components/SearchBar";
// import FilterPanel from "../components/FilterPanel";
// import EmployeeForm from "../components/EmployeeForm";
// import EmployeeList from "../components/EmployeeList";

// interface DashboardProps {
//   employees: Employee[];
//   totalEmployees: number;

//   addEmployee: (employee: Employee) => void;
//   deleteEmployee: (id: number) => void;
//   toggleStatus: (id: number) => void;

//   search: string;
//   setSearch: React.Dispatch<React.SetStateAction<string>>;

//   departmentFilter: string;
//   setDepartmentFilter: React.Dispatch<React.SetStateAction<string>>;

//   statusFilter: string;
//   setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
// }

// function Dashboard({
//   employees,
//   totalEmployees,
//   addEmployee,
//   deleteEmployee,
//   toggleStatus,
//   search,
//   setSearch,
//   departmentFilter,
//   setDepartmentFilter,
//   statusFilter,
//   setStatusFilter,
// }: DashboardProps) {
//   return (
//     <main className="dashboard">

//       <DashboardHeader totalEmployees={totalEmployees} />

//       <div className="toolbar">

//         <SearchBar
//           search={search}
//           setSearch={setSearch}
//         />

//         <FilterPanel
//           department={departmentFilter}
//           setDepartment={setDepartmentFilter}
//           status={statusFilter}
//           setStatus={setStatusFilter}
//         />

//       </div>

//       <EmployeeForm
//         addEmployee={addEmployee}
//       />

//       <EmployeeList
//         employees={employees}
//         deleteEmployee={deleteEmployee}
//         toggleStatus={toggleStatus}
//       />

//     </main>
//   );
// }

// export default Dashboard;


import { useState } from "react";
import type { Employee } from "../App";

import DashboardHeader from "../components/DashboardHeader";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

interface DashboardProps {
  employees: Employee[];
  totalEmployees: number;

  addEmployee: (employee: Employee) => void;
  deleteEmployee: (id: number) => void;
  toggleStatus: (id: number) => void;

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  departmentFilter: string;
  setDepartmentFilter: React.Dispatch<React.SetStateAction<string>>;

  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
}

function Dashboard({
  employees,
  totalEmployees,

  addEmployee,
  deleteEmployee,
  toggleStatus,

  search,
  setSearch,

  departmentFilter,
  setDepartmentFilter,

  statusFilter,
  setStatusFilter,
}: DashboardProps) {
  const [showForm, setShowForm] = useState(false);

  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (emp) => emp.status === "Inactive"
  ).length;

  const departments = new Set(
    employees.map((emp) => emp.department)
  ).size;

  return (
    <main className="dashboard">

      <DashboardHeader
        totalEmployees={totalEmployees}
        activeEmployees={activeEmployees}
        inactiveEmployees={inactiveEmployees}
        departments={departments}
        openForm={() => setShowForm(true)}
      />

      <div className="toolbar">

        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <FilterPanel
          department={departmentFilter}
          setDepartment={setDepartmentFilter}
          status={statusFilter}
          setStatus={setStatusFilter}
        />

      </div>

      {showForm && (
        <div className="modal-overlay">

          <div className="modal">

            <button
              className="close-btn"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

            <EmployeeForm
              addEmployee={(employee) => {
                addEmployee(employee);
                setShowForm(false);
              }}
            />

          </div>

        </div>
      )}

      <EmployeeList
        employees={employees}
        deleteEmployee={deleteEmployee}
        toggleStatus={toggleStatus}
      />

    </main>
  );
}

export default Dashboard;