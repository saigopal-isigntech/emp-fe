// import EmployeeCard from "./EmployeeCard";
// import { useEmployeeContext } from "../context/EmployeeContext";

// function EmployeeList() {
//   const {
//     filteredEmployees,
//     deleteEmployee,
//     toggleStatus,
//   } = useEmployeeContext();

//   if (filteredEmployees.length === 0) {
//     return (
//       <div className="empty-state">
//         <h2>No Employees Found</h2>
//         <p>Try changing the search or filter.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="employee-grid">
//       {filteredEmployees.map((employee) => (
//         <EmployeeCard
//           key={employee.id}
//           employee={employee}
//           // deleteEmployee={deleteEmployee}
//           // toggleStatus={toggleStatus}
//         />
//       ))}
//     </div>
//   );
// }

// export default EmployeeList;


import EmployeeCard from "./EmployeeCard";
import { useEmployeeContext } from "../context/EmployeeContext";

function EmployeeList() {
  const { filteredEmployees } = useEmployeeContext();

  if (filteredEmployees.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-700">
          No Employees Found
        </h2>

        <p className="mt-2 text-slate-500">
          Try changing the search keyword or filter options.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
      "
    >
      {filteredEmployees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
        />
      ))}
    </div>
  );
}

export default EmployeeList;