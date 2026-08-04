// import DashboardHeader from "../components/DashboardHeader";
// import { useEmployeeContext } from "../context/EmployeeContext";

// function Dashboard() {
//   const { employees } = useEmployeeContext();

//   const totalEmployees = employees.length;

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
//           Use the sidebar to navigate between Dashboard and Employee List.
//         </p>
//       </div>
//     </>
//   );
// }

// export default Dashboard;



// import DashboardHeader from "../components/DashboardHeader";
// import { useEmployeeContext } from "../context/EmployeeContext";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// function Dashboard() {
//   const { employees } = useEmployeeContext();

//   const totalEmployees = employees.length;

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
//     <div className="space-y-8">
//       <DashboardHeader
//         totalEmployees={totalEmployees}
//         activeEmployees={activeEmployees}
//         inactiveEmployees={inactiveEmployees}
//         departments={departments}
//         openForm={() => {}}
//       />

//       <Card className="shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-2xl">
//             Dashboard Overview
//           </CardTitle>

//           <CardDescription>
//             Employee Management System Summary
//           </CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <p className="text-slate-600 leading-7">
//             Welcome to the Employee Management System.
//             This dashboard provides a centralized view of
//             your employees and organization.
//           </p>

//           <p className="text-slate-600 leading-7">
//             Use the navigation menu to manage employees,
//             update information, and monitor workforce
//             statistics in real time.
//           </p>

//           <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
//             <div className="rounded-lg border bg-slate-50 p-5">
//               <h3 className="text-lg font-semibold text-slate-800">
//                 Employee Management
//               </h3>

//               <p className="mt-2 text-sm text-slate-500">
//                 Add, edit, delete, search and filter employee
//                 records efficiently.
//               </p>
//             </div>

//             <div className="rounded-lg border bg-slate-50 p-5">
//               <h3 className="text-lg font-semibold text-slate-800">
//                 Dashboard Analytics
//               </h3>

//               <p className="mt-2 text-sm text-slate-500">
//                 Monitor employee statistics including active,
//                 inactive employees and department distribution.
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default Dashboard;


import DashboardHeader from "../components/DashboardHeader";
import { useEmployeeContext } from "../context/EmployeeContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FaUsers,
  FaChartLine,
  FaUserCheck,
  FaBuilding,
} from "react-icons/fa";

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
    <div className="space-y-8">

      <DashboardHeader
        totalEmployees={totalEmployees}
        activeEmployees={activeEmployees}
        inactiveEmployees={inactiveEmployees}
        departments={departments}
        openForm={() => {}}
      />

      {/* Welcome Card */}

      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-bold">
            Welcome 👋
          </h1>

          <p className="mt-3 max-w-3xl text-blue-100 leading-7">
            Manage your employees, departments, and
            workforce efficiently from one centralized
            dashboard.
          </p>
        </div>

        <CardContent className="p-8">
          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <FaUsers className="text-xl text-blue-600" />
              </div>

              <h2 className="text-xl font-semibold text-slate-800">
                Employee Management
              </h2>

              <p className="mt-3 text-slate-600 leading-7">
                Add, update, delete and search employee
                records with an easy-to-use interface.
              </p>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <FaChartLine className="text-xl text-purple-600" />
              </div>

              <h2 className="text-xl font-semibold text-slate-800">
                Dashboard Analytics
              </h2>

              <p className="mt-3 text-slate-600 leading-7">
                View employee statistics, department
                distribution and workforce insights.
              </p>

            </div>

          </div>

          {/* Quick Statistics */}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-blue-50 p-5">
              <FaUsers className="mb-3 text-2xl text-blue-600" />

              <p className="text-sm text-slate-500">
                Total Employees
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-800">
                {totalEmployees}
              </h2>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <FaUserCheck className="mb-3 text-2xl text-green-600" />

              <p className="text-sm text-slate-500">
                Active Employees
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-800">
                {activeEmployees}
              </h2>
            </div>

            <div className="rounded-xl bg-red-50 p-5">
              <FaUserCheck className="mb-3 text-2xl text-red-600" />

              <p className="text-sm text-slate-500">
                Inactive Employees
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-800">
                {inactiveEmployees}
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-50 p-5">
              <FaBuilding className="mb-3 text-2xl text-yellow-600" />

              <p className="text-sm text-slate-500">
                Departments
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-800">
                {departments}
              </h2>
            </div>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}

export default Dashboard;