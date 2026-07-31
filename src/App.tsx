// import { useEffect, useState } from "react";
// import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import "./App.css";

// export interface Employee {
//   id: number;
//   name: string;
//   department: string;
//   designation: string;
//   email: string;
//   status: "Active" | "Inactive";
// }

// function App() {
//   const [employees, setEmployees] = useState<Employee[]>([]);

//   const [search, setSearch] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   useEffect(() => {
//     setEmployees([
//       {
//         id: 101,
//         name: "Sai Gopal",
//         department: "IT",
//         designation: "Java Full Stack Developer",
//         email: "saigopal@gmail.com",
//         status: "Active",
//       },
//       {
//         id: 102,
//         name: "Rahul Sharma",
//         department: "HR",
//         designation: "HR Manager",
//         email: "rahul@gmail.com",
//         status: "Inactive",
//       },
//       {
//         id: 103,
//         name: "Priya",
//         department: "Finance",
//         designation: "Accountant",
//         email: "priya@gmail.com",
//         status: "Active",
//       },
//       {
//         id: 104,
//         name: "Ajay Kumar",
//         department: "Sales",
//         designation: "Sales Executive",
//         email: "Ajay@gmail.com",
//         status: "Active",
//       },
//     ]);
//   }, []);

//   const addEmployee = (employee: Employee) => {
//     setEmployees((prev) => [...prev, employee]);
//   };

//   const deleteEmployee = (id: number) => {
//     setEmployees((prev) => prev.filter((emp) => emp.id !== id));
//   };

//   const toggleStatus = (id: number) => {
//     setEmployees((prev) =>
//       prev.map((emp) =>
//         emp.id === id
//           ? {
//               ...emp,
//               status: emp.status === "Active" ? "Inactive" : "Active",
//             }
//           : emp
//       )
//     );
//   };

//   const filteredEmployees = employees.filter((employee) => {
//     const searchMatch =
//       employee.name.toLowerCase().includes(search.toLowerCase()) ||
//       employee.id.toString().includes(search);

//     const departmentMatch =
//       departmentFilter === "" ||
//       employee.department === departmentFilter;

//     const statusMatch =
//       statusFilter === "" ||
//       employee.status === statusFilter;

//     return searchMatch && departmentMatch && statusMatch;
//   });

//   return (
//     <div className="app">

//       <Header />

//       <div className="main-layout">

//         <Sidebar />

//         <Dashboard
//           employees={filteredEmployees}
//           totalEmployees={employees.length}
//           addEmployee={addEmployee}
//           deleteEmployee={deleteEmployee}
//           toggleStatus={toggleStatus}
//           search={search}
//           setSearch={setSearch}
//           departmentFilter={departmentFilter}
//           setDepartmentFilter={setDepartmentFilter}
//           statusFilter={statusFilter}
//           setStatusFilter={setStatusFilter}
//         />

//       </div>

//     </div>
//   );
// }

// export default App;


// import { useEffect, useState } from "react";
// import { Routes, Route } from "react-router-dom";

// import MainLayout from "./layouts/MainLayout";

// import Dashboard from "./pages/Dashboard";
// import EmployeeListPage from "./pages/EmployeeListPage";
// import EmployeeDetails from "./pages/EmployeeDetails";
// import PageNotFound from "./pages/PageNotFound";

// import "./App.css";

// export interface Employee {
//   id: number;
//   name: string;
//   department: string;
//   designation: string;
//   email: string;
//   status: "Active" | "Inactive";
// }

// function App() {
//   const [employees, setEmployees] = useState<Employee[]>([]);

//   const [search, setSearch] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   useEffect(() => {
//     setEmployees([
//       {
//         id: 101,
//         name: "Sai Gopal",
//         department: "IT",
//         designation: "Java Full Stack Developer",
//         email: "saigopal@gmail.com",
//         status: "Active",
//       },
//       {
//         id: 102,
//         name: "Rahul Sharma",
//         department: "HR",
//         designation: "HR Manager",
//         email: "rahul@gmail.com",
//         status: "Inactive",
//       },
//       {
//         id: 103,
//         name: "Priya",
//         department: "Finance",
//         designation: "Accountant",
//         email: "priya@gmail.com",
//         status: "Active",
//       },
//       {
//         id: 104,
//         name: "Ajay Kumar",
//         department: "Sales",
//         designation: "Sales Executive",
//         email: "ajay@gmail.com",
//         status: "Active",
//       },
//     ]);
//   }, []);

//   const addEmployee = (employee: Employee) => {
//     setEmployees((prev) => [...prev, employee]);
//   };

//   const deleteEmployee = (id: number) => {
//     setEmployees((prev) => prev.filter((emp) => emp.id !== id));
//   };

//   const toggleStatus = (id: number) => {
//     setEmployees((prev) =>
//       prev.map((emp) =>
//         emp.id === id
//           ? {
//             ...emp,
//             status:
//               emp.status === "Active" ? "Inactive" : "Active",
//           }
//           : emp
//       )
//     );
//   };

//   const filteredEmployees = employees.filter((employee) => {
//     const searchMatch =
//       employee.name.toLowerCase().includes(search.toLowerCase()) ||
//       employee.id.toString().includes(search);

//     const departmentMatch =
//       departmentFilter === "" ||
//       employee.department === departmentFilter;

//     const statusMatch =
//       statusFilter === "" ||
//       employee.status === statusFilter;

//     return searchMatch && departmentMatch && statusMatch;
//   });

//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
//         <Route
//           path="/"
//           element={
//             <Dashboard
//               employees={filteredEmployees}
//               totalEmployees={employees.length}
//               addEmployee={addEmployee}
//               deleteEmployee={deleteEmployee}
//               toggleStatus={toggleStatus}
//               search={search}
//               setSearch={setSearch}
//               departmentFilter={departmentFilter}
//               setDepartmentFilter={setDepartmentFilter}
//               statusFilter={statusFilter}
//               setStatusFilter={setStatusFilter}
//             />
//           }
//         />

//         <Route
//           path="/employees"
//           element={
//             <EmployeeListPage
//               employees={filteredEmployees}
//               addEmployee={addEmployee}
//               deleteEmployee={deleteEmployee}
//               toggleStatus={toggleStatus}
//               search={search}
//               setSearch={setSearch}
//               departmentFilter={departmentFilter}
//               setDepartmentFilter={setDepartmentFilter}
//               statusFilter={statusFilter}
//               setStatusFilter={setStatusFilter}
//             />
//           }
//         />

//         <Route
//           path="/employees/:id"
//           element={
//             <EmployeeDetails
//               employees={employees}
//             />
//           }
//         />
//       </Route>

//       <Route path="*" element={<PageNotFound />} />
//     </Routes>
//   );
// }

// export default App;





import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetails from "./pages/EmployeeDetails";
import PageNotFound from "./pages/PageNotFound";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/employees"
          element={<EmployeeListPage />}
        />

        <Route
          path="/employees/:id"
          element={<EmployeeDetails />}
        />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;