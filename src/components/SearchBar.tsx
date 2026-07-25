interface SearchBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

function SearchBar({
  search,
  setSearch,
}: SearchBarProps) {
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