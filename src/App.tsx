import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import "./App.css";

export interface Employee {
  id: number;
  name: string;
  department: string;
 designation: string;
  email: string;
  status: string;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 101,
      name: "Sai Gopal",
      department: "IT",
      designation: "Frontend Developer",
      email: "sai@gmail.com",
      status: "Active",
    },
    {
      id: 102,
      name: "Rahul",
      department: "HR",
      designation: "Manager",
      email: "rahul@gmail.com",
      status: "Inactive",
    },
  ]);

  const addEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
  };

  const deleteEmployee = (id: number) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  const toggleStatus = (id: number) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id
          ? {
              ...emp,
              status: emp.status === "Active" ? "Inactive" : "Active",
            }
          : emp
      )
    );
  };

  return (
    <div className="app">
      <Header />

      <div className="container">
        <Sidebar />

        <Dashboard
          employees={employees}
          addEmployee={addEmployee}
          deleteEmployee={deleteEmployee}
          toggleStatus={toggleStatus}
        />
      </div>
    </div>
  );
}

export default App;