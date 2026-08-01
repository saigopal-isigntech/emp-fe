import { useEmployeeContext } from "../context/EmployeeContext";

function SearchBar() {
  const { search, setSearch } = useEmployeeContext();

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Search by Employee Name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;