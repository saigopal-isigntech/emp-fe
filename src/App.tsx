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
//   status: string;
// }

// function App() {
//   // Employee State
//   const [employees, setEmployees] = useState<Employee[]>([]);

//   // Search State
//   const [search, setSearch] = useState("");

//   // Filter States
//   const [departmentFilter, setDepartmentFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // Load Sample Data on Component Mount
//   useEffect(() => {
//     setEmployees([
//       {
//         id: 101,
//         name: "Sai Gopal",
//         department: "IT",
//         designation: "Frontend Developer",
//         email: "sai@gmail.com",
//         status: "Active",
//       },
//       {
//         id: 102,
//         name: "Rahul",
//         department: "HR",
//         designation: "Manager",
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
//         name: "Kiran",
//         department: "Sales",
//         designation: "Sales Executive",
//         email: "kiran@gmail.com",
//         status: "Active",
//       },
//     ]);
//   }, []);

//   // Add Employee
//   const addEmployee = (employee: Employee) => {
//     setEmployees((prevEmployees) => [...prevEmployees, employee]);
//   };

//   // Delete Employee
//   const deleteEmployee = (id: number) => {
//     setEmployees((prevEmployees) =>
//       prevEmployees.filter((emp) => emp.id !== id)
//     );
//   };

//   // Toggle Employee Status
//   const toggleStatus = (id: number) => {
//     setEmployees((prevEmployees) =>
//       prevEmployees.map((emp) =>
//         emp.id === id
//           ? {
//               ...emp,
//               status: emp.status === "Active" ? "Inactive" : "Active",
//             }
//           : emp
//       )
//     );
//   };

//   // Search + Filter Logic
//   const filteredEmployees = employees.filter((employee) => {
//     const matchesSearch =
//       employee.name.toLowerCase().includes(search.toLowerCase()) ||
//       employee.id.toString().includes(search);

//     const matchesDepartment =
//       departmentFilter === "" ||
//       employee.department === departmentFilter;

//     const matchesStatus =
//       statusFilter === "" ||
//       employee.status === statusFilter;

//     return matchesSearch && matchesDepartment && matchesStatus;
//   });

//   return (
//     <div className="app">
//       <Header />

//       <div className="container">
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


import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./App.css";

export interface Employee {
  id: number;
  name: string;
  department: string;
  designation: string;
  email: string;
  status: "Active" | "Inactive";
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setEmployees([
      {
        id: 101,
        name: "Sai Gopal",
        department: "IT",
        designation: "Frontend Developer",
        email: "saigopal@gmail.com",
        status: "Active",
      },
      {
        id: 102,
        name: "Rahul Sharma",
        department: "HR",
        designation: "HR Manager",
        email: "rahul@gmail.com",
        status: "Inactive",
      },
      {
        id: 103,
        name: "Priya",
        department: "Finance",
        designation: "Accountant",
        email: "priya@gmail.com",
        status: "Active",
      },
      {
        id: 104,
        name: "Kiran",
        department: "Sales",
        designation: "Sales Executive",
        email: "kiran@gmail.com",
        status: "Active",
      },
    ]);
  }, []);

  const addEmployee = (employee: Employee) => {
    setEmployees((prev) => [...prev, employee]);
  };

  const deleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const toggleStatus = (id: number) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: emp.status === "Active" ? "Inactive" : "Active",
            }
          : emp
      )
    );
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchMatch =
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.id.toString().includes(search);

    const departmentMatch =
      departmentFilter === "" ||
      employee.department === departmentFilter;

    const statusMatch =
      statusFilter === "" ||
      employee.status === statusFilter;

    return searchMatch && departmentMatch && statusMatch;
  });

  return (
    <div className="app">

      <Header />

      <div className="main-layout">

        <Sidebar />

        <Dashboard
          employees={filteredEmployees}
          totalEmployees={employees.length}
          addEmployee={addEmployee}
          deleteEmployee={deleteEmployee}
          toggleStatus={toggleStatus}
          search={search}
          setSearch={setSearch}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

      </div>

    </div>
  );
}

export default App;