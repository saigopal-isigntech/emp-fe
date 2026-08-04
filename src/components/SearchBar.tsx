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


import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEmployeeContext } from "../context/EmployeeContext";

function SearchBar() {
  const { search, setSearch } = useEmployeeContext();

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

      <Input
        type="text"
        placeholder="Search by Employee Name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-11 pl-10"
      />
    </div>
  );
}

export default SearchBar;