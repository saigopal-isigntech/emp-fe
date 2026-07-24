import { useState } from "react";
import type { Employee } from "../App";
import EmployeeList from "./EmployeeList";

interface DashboardProps {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  deleteEmployee: (id: number) => void;
  toggleStatus: (id: number) => void;
}

function Dashboard({
  employees,
  addEmployee,
  deleteEmployee,
  toggleStatus,
}: DashboardProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addEmployee({
      id: Number(id),
      name,
      department,
      designation,
      email,
      status: "Active",
    });

    setId("");
    setName("");
    setDepartment("");
    setDesignation("");
    setEmail("");
  };

  return (
    <main className="dashboard">
      <h2>Employee Dashboard</h2>

      <form onSubmit={handleSubmit} className="form">

        <input
          type="number"
          placeholder="Employee ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Designation"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">
          Add Employee
        </button>

      </form>

      <EmployeeList
        employees={employees}
        deleteEmployee={deleteEmployee}
        toggleStatus={toggleStatus}
      />
    </main>
  );
}

export default Dashboard;