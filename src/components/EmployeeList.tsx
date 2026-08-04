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


// import EmployeeCard from "./EmployeeCard";
// import { useEmployeeContext } from "../context/EmployeeContext";

// function EmployeeList() {
//   const { filteredEmployees } = useEmployeeContext();

//   if (filteredEmployees.length === 0) {
//     return (
//       <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
//         <h2 className="text-2xl font-bold text-slate-700">
//           No Employees Found
//         </h2>

//         <p className="mt-2 text-slate-500">
//           Try changing the search keyword or filter options.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="
//         grid
//         grid-cols-1
//         gap-6
//         md:grid-cols-2
//         xl:grid-cols-3
//         2xl:grid-cols-4
//       "
//     >
//       {filteredEmployees.map((employee) => (
//         <EmployeeCard
//           key={employee.id}
//           employee={employee}
//         />
//       ))}
//     </div>
//   );
// }

// export default EmployeeList;




import EmployeeCard from "./EmployeeCard";
import { useEmployeeContext } from "../context/EmployeeContext";
import { FaUsers } from "react-icons/fa";

function EmployeeList() {
  const { filteredEmployees } = useEmployeeContext();

  if (filteredEmployees.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 shadow-md">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <FaUsers className="text-4xl text-slate-400" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800">
          No Employees Found
        </h2>

        <p className="mt-3 max-w-md text-center text-slate-500">
          No employee records match your current search or filter.
          Try changing the search keyword or selecting different
          filter options.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Employee Directory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-blue-600">
              {filteredEmployees.length}
            </span>{" "}
            employee{filteredEmployees.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Employee Grid */}
      <div
        className="
          grid
          gap-6
          grid-cols-1
          sm:grid-cols-2
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
    </section>
  );
}

export default EmployeeList;