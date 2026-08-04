// import {
//   FaUsers,
//   FaUserCheck,
//   FaUserTimes,
//   FaBuilding,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";


// interface DashboardHeaderProps {
//   totalEmployees: number;
//   activeEmployees: number;
//   inactiveEmployees: number;
//   departments: number;
//   openForm: () => void;
// }

// function DashboardHeader({
//   totalEmployees,
//   activeEmployees,
//   inactiveEmployees,
//   departments,
//   // openForm,
// }: DashboardHeaderProps) {
//   const navigate = useNavigate();
//   return (
//     <>
//       {/* Welcome Section */}
//       <div className="welcome-section">
//         <div>
//           <h2>Welcome Back 👋</h2>
//           <p>Manage your employees efficiently from one place.</p>
//         </div>

//         {/* <button className="add-btn" onClick={openForm}>  // to open the form when button is clicked
//           + Add Employee
//         </button> */}
//         {/* <button
//       className="add-btn"
//       onClick={() => navigate("/employees")}
//     >
//       + Add Employee
//     </button> */}
//     <button
//   className="add-btn"
//   onClick={() => navigate("/employees")}
// >
//   + Add Employee
// </button>
//       </div>

//       {/* Statistics Cards */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-icon blue">
//             <FaUsers />
//           </div>

//           <div>
//             <h3>{totalEmployees}</h3>
//             <p>Total Employees</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon green">
//             <FaUserCheck />
//           </div>

//           <div>
//             <h3>{activeEmployees}</h3>
//             <p>Active Employees</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon red">
//             <FaUserTimes />
//           </div>

//           <div>
//             <h3>{inactiveEmployees}</h3>
//             <p>Inactive Employees</p>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon orange">
//             <FaBuilding />
//           </div>

//           <div>
//             <h3>{departments}</h3>
//             <p>Departments</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default DashboardHeader;



// import {
//   FaUsers,
//   FaUserCheck,
//   FaUserTimes,
//   FaBuilding,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";

// interface DashboardHeaderProps {
//   totalEmployees: number;
//   activeEmployees: number;
//   inactiveEmployees: number;
//   departments: number;
//   openForm: () => void;
// }

// function DashboardHeader({
//   totalEmployees,
//   activeEmployees,
//   inactiveEmployees,
//   departments,
// }: DashboardHeaderProps) {
//   const navigate = useNavigate();

//   const stats = [
//     {
//       title: "Total Employees",
//       value: totalEmployees,
//       icon: <FaUsers className="text-2xl text-blue-600" />,
//       bg: "bg-blue-100",
//     },
//     {
//       title: "Active Employees",
//       value: activeEmployees,
//       icon: <FaUserCheck className="text-2xl text-green-600" />,
//       bg: "bg-green-100",
//     },
//     {
//       title: "Inactive Employees",
//       value: inactiveEmployees,
//       icon: <FaUserTimes className="text-2xl text-red-600" />,
//       bg: "bg-red-100",
//     },
//     {
//       title: "Departments",
//       value: departments,
//       icon: <FaBuilding className="text-2xl text-orange-600" />,
//       bg: "bg-orange-100",
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Welcome Section */}
//       <div className="flex flex-col gap-6 rounded-xl border bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-800">
//             Welcome Back 👋
//           </h1>

//           <p className="mt-2 text-slate-500">
//             Manage your employees efficiently from one place.
//           </p>
//         </div>

//         <Button
//           size="lg"
//           onClick={() => navigate("/employees")}
//         >
//           + Add Employee
//         </Button>
//       </div>

//       {/* Statistics */}
//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
//         {stats.map((item) => (
//           <Card
//             key={item.title}
//             className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
//           >
//             <CardContent className="flex items-center justify-between p-6">
//               <div>
//                 <p className="text-sm text-slate-500">
//                   {item.title}
//                 </p>

//                 <h2 className="mt-2 text-3xl font-bold text-slate-800">
//                   {item.value}
//                 </h2>
//               </div>

//               <div
//                 className={`flex h-14 w-14 items-center justify-center rounded-full ${item.bg}`}
//               >
//                 {item.icon}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default DashboardHeader;



import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaBuilding,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardHeaderProps {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departments: number;
  openForm: () => void;
}

function DashboardHeader({
  totalEmployees,
  activeEmployees,
  inactiveEmployees,
  departments,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <FaUsers />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: <FaUserCheck />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Inactive Employees",
      value: inactiveEmployees,
      icon: <FaUserTimes />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Departments",
      value: departments,
      icon: <FaBuilding />,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome Back 👋
            </h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              Monitor your workforce, manage employees, and
              keep track of organizational statistics from
              one centralized dashboard.
            </p>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="rounded-xl"
            onClick={() => navigate("/employees")}
          >
            Manage Employees
            <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card
            key={item.title}
            className="border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-4xl font-bold text-slate-800">
                    {item.value}
                  </h2>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}
                >
                  <span className={`text-2xl ${item.color}`}>
                    {item.icon}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DashboardHeader;