import type { Employee } from "../types/Employee";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";

import {
  FaUserCircle,
  FaEnvelope,
  FaBuilding,
  FaBriefcase,
  FaTrash,
  FaSyncAlt,
  FaEye,
} from "react-icons/fa";

interface EmployeeCardProps {
  employee: Employee;
}

function EmployeeCard({ employee }: EmployeeCardProps) {
  const navigate = useNavigate();

  const { deleteEmployee, toggleStatus } = useEmployeeContext();

  return (
    <div className="employee-card">
      <div className="card-top">
        <FaUserCircle className="employee-avatar" />

        <div>
          <h3>{employee.name}</h3>

          <span
            className={
              employee.status === "Active"
                ? "status active-status"
                : "status inactive-status"
            }
          >
            {employee.status}
          </span>
        </div>
      </div>

      <div className="employee-info">
        <p>
          <FaBriefcase /> {employee.designation}
        </p>

        <p>
          <FaBuilding /> {employee.department}
        </p>

        <p>
          <FaEnvelope /> {employee.email}
        </p>

        <p>
          <strong>Employee ID :</strong> {employee.id}
        </p>
      </div>

      <div className="employee-actions">
        <button
          className="toggle-btn"
          onClick={() => toggleStatus(employee.id)}
        >
          <FaSyncAlt /> Toggle
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteEmployee(employee.id)}
        >
          <FaTrash /> Delete
        </button>

        <button
          className="toggle-btn"
          onClick={() => navigate(`/employees/${employee.id}`)}
        >
          <FaEye /> View Details
        </button>
      </div>
    </div>
  );
}

export default EmployeeCard;