// import type { Employee } from "../types/Employee";
// import { useNavigate } from "react-router-dom";
// import { useEmployeeContext } from "../context/EmployeeContext";

// import {
//   FaUserCircle,
//   FaEnvelope,
//   FaBuilding,
//   FaBriefcase,
//   FaTrash,
//   FaSyncAlt,
//   FaEye,
// } from "react-icons/fa";

// interface EmployeeCardProps {
//   employee: Employee;
// }

// function EmployeeCard({ employee }: EmployeeCardProps) {
//   const navigate = useNavigate();

//   const { deleteEmployee, toggleStatus } = useEmployeeContext();

//   return (
//     <div className="employee-card">
//       <div className="card-top">
//         <FaUserCircle className="employee-avatar" />

//         <div>
//           <h3>{employee.name}</h3>

//           <span
//             className={
//               employee.status === "Active"
//                 ? "status active-status"
//                 : "status inactive-status"
//             }
//           >
//             {employee.status}
//           </span>
//         </div>
//       </div>

//       <div className="employee-info">
//         <p>
//           <FaBriefcase /> {employee.designation}
//         </p>

//         <p>
//           <FaBuilding /> {employee.department}
//         </p>

//         <p>
//           <FaEnvelope /> {employee.email}
//         </p>

//         <p>
//           <strong>Employee ID :</strong> {employee.id}
//         </p>
//       </div>

//       <div className="employee-actions">
//         <button
//           className="toggle-btn"
//           onClick={() => toggleStatus(employee.id)}
//         >
//           <FaSyncAlt /> Toggle
//         </button>

//         <button
//           className="delete-btn"
//           onClick={() => deleteEmployee(employee.id)}
//         >
//           <FaTrash /> Delete
//         </button>

//         <button
//           className="toggle-btn"
//           onClick={() => navigate(`/employees/${employee.id}`)}
//         >
//           <FaEye /> View Details
//         </button>
//       </div>
//     </div>
//   );
// }

// export default EmployeeCard;


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

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

interface EmployeeCardProps {
  employee: Employee;
}

function EmployeeCard({ employee }: EmployeeCardProps) {
  const navigate = useNavigate();

  const { deleteEmployee, toggleStatus } =
    useEmployeeContext();

  return (
    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <CardContent className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <FaUserCircle className="text-6xl text-blue-600" />

          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">
              {employee.name}
            </h2>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                employee.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {employee.status}
            </span>
          </div>
        </div>

        {/* Employee Information */}
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-3">
            <FaBriefcase className="text-slate-500" />

            <span>{employee.designation}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaBuilding className="text-slate-500" />

            <span>{employee.department}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaEnvelope className="text-slate-500" />

            <span>{employee.email}</span>
          </div>

          <div>
            <span className="font-semibold">
              Employee ID :
            </span>{" "}
            {employee.id}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button
            variant="outline"
            onClick={() =>
              toggleStatus(employee.id)
            }
          >
            <FaSyncAlt className="mr-2" />
            Toggle
          </Button>

          <Button
            variant="destructive"
            onClick={() =>
              deleteEmployee(employee.id)
            }
          >
            <FaTrash className="mr-2" />
            Delete
          </Button>

          <Button
            onClick={() =>
              navigate(`/employees/${employee.id}`)
            }
          >
            <FaEye className="mr-2" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmployeeCard;