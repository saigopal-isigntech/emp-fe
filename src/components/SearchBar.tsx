import { useEmployeeContext } from "../context/EmployeeContext";
import { Search, X } from "lucide-react";

function SearchBar() {
  const { search, setSearch } = useEmployeeContext();

  return (
    <div className="flex-1 min-w-[240px]">
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        Search Records
      </label>
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-8 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#4f46e5] focus:bg-white focus:ring-4 focus:ring-indigo-500/15 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            title="Clear search"
            className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
