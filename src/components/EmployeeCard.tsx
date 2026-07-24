// import type { Employee } from "../App";

// interface EmployeeCardProps {
//   employee: Employee;
//   deleteEmployee: (id: number) => void;
//   toggleStatus: (id: number) => void;
// }

// function EmployeeCard({
//   employee,
//   deleteEmployee,
//   toggleStatus,
// }: EmployeeCardProps) {
//   return (
//     <div className="card">
//       <h3>{employee.name}</h3>

//       <p>
//         <strong>ID :</strong> {employee.id}
//       </p>

//       <p>
//         <strong>Department :</strong> {employee.department}
//       </p>

//       <p>
//         <strong>Designation :</strong> {employee.designation}
//       </p>

//       <p>
//         <strong>Email :</strong> {employee.email}
//       </p>

//       <p>
//         <strong>Status :</strong>{" "}
//         <span
//           className={
//             employee.status === "Active"
//               ? "active"
//               : "inactive"
//           }
//         >
//           {employee.status}
//         </span>
//       </p>

//       <div className="card-buttons">
//         <button
//           className="status-btn"
//           onClick={() => toggleStatus(employee.id)}
//         >
//           Toggle Status
//         </button>

//         <button
//           className="delete"
//           onClick={() => deleteEmployee(employee.id)}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// export default EmployeeCard;

import type { Employee } from "../App";
import {
  FaUserCircle,
  FaEnvelope,
  FaBuilding,
  FaBriefcase,
  FaTrash,
  FaSyncAlt,
} from "react-icons/fa";

interface EmployeeCardProps {
  employee: Employee;
  deleteEmployee: (id: number) => void;
  toggleStatus: (id: number) => void;
}

function EmployeeCard({
  employee,
  deleteEmployee,
  toggleStatus,
}: EmployeeCardProps) {
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
          <FaBriefcase />
          {employee.designation}
        </p>

        <p>
          <FaBuilding />
          {employee.department}
        </p>

        <p>
          <FaEnvelope />
          {employee.email}
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
          <FaSyncAlt />
          Toggle
        </button>

        <button
          className="delete-btn"
          onClick={() => deleteEmployee(employee.id)}
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </div>
  );
}

export default EmployeeCard;