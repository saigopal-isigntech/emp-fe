import { useParams, Link } from "react-router-dom";
import type { Employee } from "../App";

interface EmployeeDetailsProps {
  employees: Employee[];
}

function EmployeeDetails({
  employees,
}: EmployeeDetailsProps) {
  const { id } = useParams();

  const employee = employees.find(
    (emp) => emp.id === Number(id)
  );

  if (!employee) {
    return (
      <>
        <h2>Employee Not Found</h2>

        <Link to="/employees">
          Back to Employee List
        </Link>
      </>
    );
  }

  return (
    <div className="form-container">
      <h2 className="form-title">
        Employee Details
      </h2>

      <div className="employee-info">
        <p><strong>ID:</strong> {employee.id}</p>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>
        <p><strong>Status:</strong> {employee.status}</p>
      </div>

      <br />

      <Link to="/employees">
        ← Back to Employee List
      </Link>
    </div>
  );
}

export default EmployeeDetails;