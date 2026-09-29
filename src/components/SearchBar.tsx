import { useEmployeeContext } from "../context/EmployeeContext";

function SearchBar() {
  const { search, setSearch } = useEmployeeContext();

  return (
    <div className="flex-1 min-w-[200px]">
      <label className="block text-xs font-medium text-slate-600 mb-1">
        Search
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name, email, or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-indigo-500"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
