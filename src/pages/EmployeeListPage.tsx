// import { useEmployeeContext } from "../context/EmployeeContext";

// import SearchBar from "../components/SearchBar";
// import FilterPanel from "../components/FilterPanel";
// import EmployeeForm from "../components/EmployeeForm";
// import EmployeeList from "../components/EmployeeList";

// function EmployeeListPage() {
//   const { loading, error } = useEmployeeContext();

//   if (loading) {
//     return <h2>Loading employees...</h2>;
//   }

//   if (error) {
//     return <h2>{error}</h2>;
//   }

//   return (
//     <>
//       <div className="section-title">
//         <div>
//           <h2>Employee List</h2>
//           <p>View and manage all employees.</p>
//         </div>
//       </div>

//       <SearchBar />

//       <FilterPanel />

//       <EmployeeForm />

//       <EmployeeList />
//     </>
//   );
// }

// export default EmployeeListPage;




import { useEmployeeContext } from "../context/EmployeeContext";

import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function EmployeeListPage() {
  const { loading, error } = useEmployeeContext();

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-lg font-medium text-slate-500">
          Loading employees...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          {error}
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-800">
          Employee Management
        </h1>

        <p className="text-slate-500">
          View, search, filter and manage employee records.
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>

          <CardDescription>
            Search employees or filter them by department
            and status.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <SearchBar />

          <FilterPanel />
        </CardContent>
      </Card>

      {/* Employee Form */}
      <EmployeeForm />

      {/* Employee List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">
          Employees
        </h2>

        <EmployeeList />
      </div>
    </div>
  );
}

export default EmployeeListPage;