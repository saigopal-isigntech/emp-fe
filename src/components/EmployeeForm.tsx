// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useEmployeeContext } from "../context/EmployeeContext";

// function EmployeeForm() {
//   const navigate = useNavigate();

//   const { addEmployee } = useEmployeeContext();

//   const nameRef = useRef<HTMLInputElement>(null);

//   const [employee, setEmployee] = useState({
//     id: "",
//     name: "",
//     department: "",
//     designation: "",
//     email: "",
//   });

//   useEffect(() => {
//     nameRef.current?.focus();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     setEmployee({
//       ...employee,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     addEmployee({
//       id: Number(employee.id),
//       name: employee.name,
//       department: employee.department,
//       designation: employee.designation,
//       email: employee.email,
//       status: "Active",
//     });

//     setEmployee({
//       id: "",
//       name: "",
//       department: "",
//       designation: "",
//       email: "",
//     });

//     navigate("/employees");
//   };

//   return (
//     <div className="form-container">
//       <h2 className="form-title">Add New Employee</h2>

//       <form className="form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Employee ID</label>

//           <input
//             type="number"
//             name="id"
//             value={employee.id}
//             onChange={handleChange}
//             placeholder="Enter Employee ID"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Employee Name</label>

//           <input
//             ref={nameRef}
//             type="text"
//             name="name"
//             value={employee.name}
//             onChange={handleChange}
//             placeholder="Enter Employee Name"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Department</label>

//           <select
//             name="department"
//             value={employee.department}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Department</option>
//             <option>IT</option>
//             <option>HR</option>
//             <option>Finance</option>
//             <option>Sales</option>
//             <option>Marketing</option>
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Designation</label>

//           <input
//             type="text"
//             name="designation"
//             value={employee.designation}
//             onChange={handleChange}
//             placeholder="Enter Designation"
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Email</label>

//           <input
//             type="email"
//             name="email"
//             value={employee.email}
//             onChange={handleChange}
//             placeholder="Enter Email Address"
//             required
//           />
//         </div>

//         <div className="form-buttons">
//           <button className="submit-btn" type="submit">
//             Add Employee
//           </button>

//           <button
//             type="button"
//             className="reset-btn"
//             onClick={() =>
//               setEmployee({
//                 id: "",
//                 name: "",
//                 department: "",
//                 designation: "",
//                 email: "",
//               })
//             }
//           >
//             Reset
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EmployeeForm;



import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeContext } from "../context/EmployeeContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function EmployeeForm() {
  const navigate = useNavigate();

  const { addEmployee } = useEmployeeContext();

  const nameRef = useRef<HTMLInputElement>(null);

  const [employee, setEmployee] = useState({
    id: "",
    name: "",
    department: "",
    designation: "",
    email: "",
  });

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleDepartmentChange = (value: string) => {
    setEmployee({
      ...employee,
      department: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addEmployee({
      id: Number(employee.id),
      name: employee.name,
      department: employee.department,
      designation: employee.designation,
      email: employee.email,
      status: "Active",
    });

    setEmployee({
      id: "",
      name: "",
      department: "",
      designation: "",
      email: "",
    });

    navigate("/employees");
  };

  const resetForm = () => {
    setEmployee({
      id: "",
      name: "",
      department: "",
      designation: "",
      email: "",
    });
  };

  return (
    <Card className="mx-auto max-w-5xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">
          Add New Employee
        </CardTitle>

        <CardDescription>
          Fill in the employee information below.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Employee ID */}
            <div className="space-y-2">
              <Label htmlFor="id">
                Employee ID
              </Label>

              <Input
                id="id"
                type="number"
                name="id"
                placeholder="Enter Employee ID"
                value={employee.id}
                onChange={handleChange}
                required
              />
            </div>

            {/* Employee Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Employee Name
              </Label>

              <Input
                ref={nameRef}
                id="name"
                type="text"
                name="name"
                placeholder="Enter Employee Name"
                value={employee.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label>Department</Label>

              <Select
                value={employee.department}
                onValueChange={
                  handleDepartmentChange
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="IT">
                    IT
                  </SelectItem>

                  <SelectItem value="HR">
                    HR
                  </SelectItem>

                  <SelectItem value="Finance">
                    Finance
                  </SelectItem>

                  <SelectItem value="Sales">
                    Sales
                  </SelectItem>

                  <SelectItem value="Marketing">
                    Marketing
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Designation */}
            <div className="space-y-2">
              <Label htmlFor="designation">
                Designation
              </Label>

              <Input
                id="designation"
                type="text"
                name="designation"
                placeholder="Enter Designation"
                value={employee.designation}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">
                Email Address
              </Label>

              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={employee.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
            >
              Reset
            </Button>

            <Button type="submit">
              Add Employee
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default EmployeeForm;