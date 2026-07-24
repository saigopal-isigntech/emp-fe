import type { Employee } from "../App";
import EmployeeCard from "./EmployeeCard";

interface EmployeeListProps {
  employees: Employee[];
  deleteEmployee: (id: number) => void;
  toggleStatus: (id: number) => void;
}

function EmployeeList({
  employees,
  deleteEmployee,
  toggleStatus,
}: EmployeeListProps) {
  if (employees.length === 0) {
    return <h2>No Employees Available</h2>;
  }

  return (
    <>
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          deleteEmployee={deleteEmployee}
          toggleStatus={toggleStatus}
        />
      ))}
    </>
  );
}

export default EmployeeList;