// import { useState } from "react";
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
//   const [showForm, setShowForm] = useState(false);

//   const activeEmployees = employees.filter(
//     (emp) => emp.status === "Active"
//   ).length;

//   const inactiveEmployees = employees.filter(
//     (emp) => emp.status === "Inactive"
//   ).length;

//   const departments = new Set(
//     employees.map((emp) => emp.department)
//   ).size;

//   return (
//     <main className="dashboard">

//       <DashboardHeader
//         totalEmployees={totalEmployees}
//         activeEmployees={activeEmployees}
//         inactiveEmployees={inactiveEmployees}
//         departments={departments}
//         openForm={() => setShowForm(true)}
//       />

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

//       {showForm && (
//         <div className="modal-overlay">

//           <div className="modal">

//             <button
//               className="close-btn"
//               onClick={() => setShowForm(false)}
//             >
//               ✕
//             </button>

//             <EmployeeForm
//               addEmployee={(employee) => {
//                 addEmployee(employee);
//                 setShowForm(false);
//               }}
//             />

//           </div>

//         </div>
//       )}

//       <EmployeeList
//         employees={employees}
//         deleteEmployee={deleteEmployee}
//         toggleStatus={toggleStatus}
//       />

//     </main>
//   );
// }

// export default Dashboard;



// import DashboardHeader from "../components/DashboardHeader";
// import type { Employee } from "../App";

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
// }: DashboardProps) {
//   const activeEmployees = employees.filter(
//     (emp) => emp.status === "Active"
//   ).length;

//   const inactiveEmployees = employees.filter(
//     (emp) => emp.status === "Inactive"
//   ).length;

//   const departments = new Set(
//     employees.map((emp) => emp.department)
//   ).size;

//   return (
//     <>
//       <DashboardHeader
//         totalEmployees={totalEmployees}
//         activeEmployees={activeEmployees}
//         inactiveEmployees={inactiveEmployees}
//         departments={departments}
//         openForm={() => {}}
//       />

//       <div
//         style={{
//           marginTop: "40px",
//           background: "#fff",
//           padding: "30px",
//           borderRadius: "16px",
//           boxShadow: "0 8px 20px rgba(0,0,0,.08)",
//         }}
//       >
//         <h2>Dashboard Overview</h2>

//         <br />

//         <p>
//           Welcome to the Employee Management System.
//         </p>

//         <br />

//         <p>
//           Use the sidebar to navigate between Dashboard,
//           Employee List .
//         </p>

//         <br />

//         {/* <p>
//           This dashboard displays employee statistics,
//           while employee management is available on the
//           Employee List page.
//         </p> */}
//       </div>
//     </>
//   );
// }

// export default Dashboard;



import DashboardHeader from "../components/DashboardHeader";
import { useEmployeeContext } from "../context/EmployeeContext";

function Dashboard() {
  const { employees } = useEmployeeContext();

  const totalEmployees = employees.length;

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
    <>
      <DashboardHeader
        totalEmployees={totalEmployees}
        activeEmployees={activeEmployees}
        inactiveEmployees={inactiveEmployees}
        departments={departments}
        openForm={() => {}}
      />

      <div
        style={{
          marginTop: "40px",
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <h2>Dashboard Overview</h2>

        <br />

        <p>
          Welcome to the Employee Management System.
        </p>

        <br />

        <p>
          Use the sidebar to navigate between Dashboard and Employee List.
        </p>
      </div>
    </>
  );
}

export default Dashboard;