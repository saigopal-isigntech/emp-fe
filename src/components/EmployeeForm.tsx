// import { useEffect, useRef, useState } from "react";
// import type { Employee } from "../App";

// interface EmployeeFormProps {
//   addEmployee: (employee: Employee) => void;
// }

// function EmployeeForm({ addEmployee }: EmployeeFormProps) {
//   const [id, setId] = useState("");
//   const [name, setName] = useState("");
//   const [department, setDepartment] = useState("");
//   const [designation, setDesignation] = useState("");
//   const [email, setEmail] = useState("");

//   // useRef to focus Employee Name input
//   const nameInputRef = useRef<HTMLInputElement>(null);

//   // useEffect runs once when component loads
//   useEffect(() => {
//     nameInputRef.current?.focus();
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     addEmployee({
//       id: Number(id),
//       name,
//       department,
//       designation,
//       email,
//       status: "Active",
//     });

//     // Clear Form
//     setId("");
//     setName("");
//     setDepartment("");
//     setDesignation("");
//     setEmail("");

//     // Focus Name field again
//     nameInputRef.current?.focus();
//   };

//   return (
//     <form className="form" onSubmit={handleSubmit}>
//       <input
//         type="number"
//         placeholder="Employee ID"
//         value={id}
//         onChange={(e) => setId(e.target.value)}
//         required
//       />

//       <input
//         ref={nameInputRef}
//         type="text"
//         placeholder="Employee Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         required
//       />

//       <select
//         value={department}
//         onChange={(e) => setDepartment(e.target.value)}
//         required
//       >
//         <option value="">Select Department</option>
//         <option value="IT">IT</option>
//         <option value="HR">HR</option>
//         <option value="Finance">Finance</option>
//         <option value="Sales">Sales</option>
//       </select>

//       <input
//         type="text"
//         placeholder="Designation"
//         value={designation}
//         onChange={(e) => setDesignation(e.target.value)}
//         required
//       />

//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />

//       <button type="submit">Add Employee</button>
//     </form>
//   );
// }

// export default EmployeeForm;

import { useEffect, useRef, useState } from "react";
import type { Employee } from "../App";

interface EmployeeFormProps {
  addEmployee: (employee: Employee) => void;
}

function EmployeeForm({ addEmployee }: EmployeeFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);

  const [employee, setEmployee] = useState({
    id: "",
    name: "",
    department: "",
    designation: "",
    email: "",
  });

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addEmployee({
      id: Number(employee.id),
      name: employee.name,
      department: employee.department,
      designation: employee.designation,
      email: employee.email,
      status: "Active",
    });

    setEmployee({
      id: "",
      name: "",
      department: "",
      designation: "",
      email: "",
    });

    nameRef.current?.focus();
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Employee</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employee ID</label>

          <input
            type="number"
            name="id"
            value={employee.id}
            onChange={handleChange}
            placeholder="Enter Employee ID"
            required
          />
        </div>

        <div className="form-group">
          <label>Employee Name</label>

          <input
            ref={nameRef}
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            placeholder="Enter Employee Name"
            required
          />
        </div>

        <div className="form-group">
          <label>Department</label>

          <select
            name="department"
            value={employee.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option>IT</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Sales</option>
            <option>Marketing</option>
          </select>
        </div>

        <div className="form-group">
          <label>Designation</label>

          <input
            type="text"
            name="designation"
            value={employee.designation}
            onChange={handleChange}
            placeholder="Enter Designation"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={handleChange}
            placeholder="Enter Email Address"
            required
          />
        </div>

        <div className="form-buttons">
          <button className="submit-btn" type="submit">
            Add Employee
          </button>

          <button
            type="button"
            className="reset-btn"
            onClick={() =>
              setEmployee({
                id: "",
                name: "",
                department: "",
                designation: "",
                email: "",
              })
            }
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;