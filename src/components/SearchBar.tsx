// import { useEmployeeContext } from "../context/EmployeeContext";

// function SearchBar() {
//   const { search, setSearch } = useEmployeeContext();

//   return (
//     <div className="search-bar">
//       <input
//         type="text"
//         placeholder="🔍 Search by Employee Name or ID..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//     </div>
//   );
// }

// export default SearchBar;


// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useEmployeeContext } from "../context/EmployeeContext";

// function SearchBar() {
//   const { search, setSearch } = useEmployeeContext();

//   return (
//     <div className="relative w-full">
//       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//       <Input
//         type="text"
//         placeholder="Search by Employee Name or ID..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="h-11 pl-10"
//       />
//     </div>
//   );
// }

// export default SearchBar;



import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEmployeeContext } from "../context/EmployeeContext";

function SearchBar() {
  const { search, setSearch } = useEmployeeContext();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        Search Employees
      </label>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <Input
          type="text"
          placeholder="Search by Employee Name or Employee ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 rounded-xl border-slate-300 pl-12 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
    </div>
  );
}

export default SearchBar;