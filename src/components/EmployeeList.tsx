// import type { Employee } from "../App";
// import EmployeeCard from "./EmployeeCard";

// interface EmployeeListProps {
//   employees: Employee[];
//   deleteEmployee: (id: number) => void;
//   toggleStatus: (id: number) => void;
// }

// function EmployeeList({
//   employees,
//   deleteEmployee,
//   toggleStatus,
// }: EmployeeListProps) {
//   if (employees.length === 0) {
//     return (
//       <h2 className="no-data">
//         No Employees Found
//       </h2>
//     );
//   }

//   return (
//     <div className="employee-list">
//       {employees.map((employee) => (
//         <EmployeeCard
//           key={employee.id}
//           employee={employee}
//           deleteEmployee={deleteEmployee}
//           toggleStatus={toggleStatus}
//         />
//       ))}
//     </div>
//   );
// }

// export default EmployeeList;

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
    return (
      <div className="empty-state">
        <h2>No Employees Found</h2>
        <p>Try changing the search or filter.</p>
      </div>
    );
  }

  return (
    <div className="employee-grid">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          deleteEmployee={deleteEmployee}
          toggleStatus={toggleStatus}
        />
      ))}
    </div>
  );
}

export default EmployeeList;