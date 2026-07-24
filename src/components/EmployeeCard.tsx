import type { Employee } from "../App";
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
    <div className="card">
      <h3>{employee.name}</h3>

      <p>
        <strong>ID:</strong> {employee.id}
      </p>

      <p>
        <strong>Department:</strong> {employee.department}
      </p>

      <p>
        <strong>Designation:</strong> {employee.designation}
      </p>

      <p>
        <strong>Email:</strong> {employee.email}
      </p>

      <p>
        <strong>Status:</strong> {employee.status}
      </p>

      <button onClick={() => toggleStatus(employee.id)}>
        Toggle Status
      </button>

      <button
        onClick={() => deleteEmployee(employee.id)}
        className="delete"
      >
        Delete
      </button>
    </div>
  );
}

export default EmployeeCard;