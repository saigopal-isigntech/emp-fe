// import { useParams, Link } from "react-router-dom";
// import { useEmployeeContext } from "../context/EmployeeContext";

// function EmployeeDetails() {
//   const { id } = useParams();

//   const { employees, loading, error } = useEmployeeContext();

//   if (loading) {
//     return <h2>Loading employee details...</h2>;
//   }

//   if (error) {
//     return <h2>{error}</h2>;
//   }

//   const employee = employees.find(
//     (emp) => emp.id === Number(id)
//   );

//   if (!employee) {
//     return (
//       <>
//         <h2>Employee Not Found</h2>

//         <Link to="/employees">
//           ← Back to Employee List
//         </Link>
//       </>
//     );
//   }

//   return (
//     <div className="form-container">
//       <h2 className="form-title">
//         Employee Details
//       </h2>

//       <div className="employee-info">
//         <p><strong>ID:</strong> {employee.id}</p>
//         <p><strong>Name:</strong> {employee.name}</p>
//         <p><strong>Email:</strong> {employee.email}</p>
//         <p><strong>Department:</strong> {employee.department}</p>
//         <p><strong>Designation:</strong> {employee.designation}</p>
//         <p><strong>Status:</strong> {employee.status}</p>
//       </div>

//       <br />

//       <Link to="/employees">
//         ← Back to Employee List
//       </Link>
//     </div>
//   );
// }

// export default EmployeeDetails;




import { useParams, Link } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  FaUserCircle,
  FaEnvelope,
  FaBuilding,
  FaBriefcase,
  FaIdBadge,
} from "react-icons/fa";

function EmployeeDetails() {
  const { id } = useParams();

  const { employees, loading, error } =
    useEmployeeContext();

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-lg text-slate-500">
          Loading employee details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          {error}
        </h2>
      </div>
    );
  }

  const employee = employees.find(
    (emp) => emp.id === Number(id)
  );

  if (!employee) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="py-10 text-center space-y-4">
          <h2 className="text-2xl font-bold">
            Employee Not Found
          </h2>

          <Button asChild>
            <Link to="/employees">
              ← Back to Employee List
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="shadow-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <FaUserCircle className="text-7xl text-blue-600" />
          </div>

          <CardTitle className="mt-3 text-3xl">
            {employee.name}
          </CardTitle>

          <CardDescription>
            {employee.designation}
          </CardDescription>

          <div className="pt-2">
            <span
              className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold ${
                employee.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {employee.status}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <FaIdBadge className="text-blue-600 text-xl" />

              <div>
                <p className="text-sm text-slate-500">
                  Employee ID
                </p>

                <p className="font-semibold">
                  {employee.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <FaEnvelope className="text-blue-600 text-xl" />

              <div>
                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-semibold break-all">
                  {employee.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <FaBuilding className="text-blue-600 text-xl" />

              <div>
                <p className="text-sm text-slate-500">
                  Department
                </p>

                <p className="font-semibold">
                  {employee.department}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <FaBriefcase className="text-blue-600 text-xl" />

              <div>
                <p className="text-sm text-slate-500">
                  Designation
                </p>

                <p className="font-semibold">
                  {employee.designation}
                </p>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end">
            <Button asChild variant="outline">
              <Link to="/employees">
                ← Back to Employee List
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EmployeeDetails;