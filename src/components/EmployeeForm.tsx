import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";

function EmployeeForm() {
  const navigate = useNavigate();

  const { addEmployee } = useEmployeeContext();

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

    navigate("/employees");
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