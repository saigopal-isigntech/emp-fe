// import type { Employee } from "../App";
// import EmployeeList from "../components/EmployeeList";

// interface EmployeeListPageProps {
//   employees: Employee[];
//   deleteEmployee: (id: number) => void;
//   toggleStatus: (id: number) => void;
// }

// function EmployeeListPage({
//   employees,
//   deleteEmployee,
//   toggleStatus,
// }: EmployeeListPageProps) {
//   return (
//     <>
//       <div className="section-title">
//         <div>
//           <h2>Employee List</h2>
//           <p>View and manage all employees.</p>
//         </div>
//       </div>

//       <EmployeeList
//         employees={employees}
//         deleteEmployee={deleteEmployee}
//         toggleStatus={toggleStatus}
//       />
//     </>
//   );
// }

// export default EmployeeListPage;


import type { Employee } from "../App";

import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

interface EmployeeListPageProps {
  employees: Employee[];

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

function EmployeeListPage({
  employees,

  addEmployee,
  deleteEmployee,
  toggleStatus,

  search,
  setSearch,

  departmentFilter,
  setDepartmentFilter,

  statusFilter,
  setStatusFilter,
}: EmployeeListPageProps) {
  return (
    <>
      <div className="section-title">
        <div>
          <h2>Employee List</h2>
          <p>View and manage all employees.</p>
        </div>
      </div>

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

      <EmployeeForm
        addEmployee={addEmployee}
      />

      <EmployeeList
        employees={employees}
        deleteEmployee={deleteEmployee}
        toggleStatus={toggleStatus}
      />
    </>
  );
}

export default EmployeeListPage;