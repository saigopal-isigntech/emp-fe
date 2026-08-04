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



import DashboardHeader from "../components/DashboardHeader";
import { useEmployeeContext } from "../context/EmployeeContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            Dashboard Overview
          </CardTitle>

          <CardDescription>
            Employee Management System Summary
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-slate-600 leading-7">
            Welcome to the Employee Management System.
            This dashboard provides a centralized view of
            your employees and organization.
          </p>

          <p className="text-slate-600 leading-7">
            Use the navigation menu to manage employees,
            update information, and monitor workforce
            statistics in real time.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
            <div className="rounded-lg border bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-800">
                Employee Management
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add, edit, delete, search and filter employee
                records efficiently.
              </p>
            </div>

            <div className="rounded-lg border bg-slate-50 p-5">
              <h3 className="text-lg font-semibold text-slate-800">
                Dashboard Analytics
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Monitor employee statistics including active,
                inactive employees and department distribution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;