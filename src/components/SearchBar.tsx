// interface SearchBarProps {
//   search: string;
//   setSearch: React.Dispatch<React.SetStateAction<string>>;
// }

// function SearchBar({
//   search,
//   setSearch,
// }: SearchBarProps) {
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

// import { NavLink } from "react-router-dom";

// function Sidebar() {
//   return (
//     <aside className="sidebar">
//       <h2 className="sidebar-title">Menu</h2>

//       <ul>
//         <li>
//           <NavLink to="/">
//             Dashboard
//           </NavLink>
//         </li>

//         <li>
//           <NavLink to="/employees">
//             Employees
//           </NavLink>
//         </li>
//       </ul>
//     </aside>
//   );
// }

// export default Sidebar;

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