// interface SearchBarProps {
//   search: string;
//   setSearch: (value: string) => void;
// }

// function SearchBar({
//   search,
//   setSearch,
// }: SearchBarProps) {
//   return (
//     <div className="search-bar">
//       <input
//         type="text"
//         placeholder="Search by Employee Name or ID..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//     </div>
//   );
// }

// export default SearchBar;

// function Sidebar() {
//   return (
//     <aside className="sidebar">

//       <ul>

//         <li className="active-menu">
//           🏠 Dashboard
//         </li>

//         <li>
//           👨 Employees
//         </li>

//         <li>
//           🏢 Departments
//         </li>

//         <li>
//           📊 Reports
//         </li>

//         <li>
//           ⚙ Settings
//         </li>

//         <li className="logout">
//           🚪 Logout
//         </li>

//       </ul>

//     </aside>
//   );
// }

// export default Sidebar;

// import {
//   FaHome,
//   FaUsers,
//   FaBuilding,
//   FaChartBar,
//   FaCog,
//   FaSignOutAlt,
// } from "react-icons/fa";

// function Sidebar() {
//   return (
//     <aside className="sidebar">

//       <div className="sidebar-title">
//         HR Dashboard
//       </div>

//       <ul>

//         <li className="active">
//           <FaHome />
//           Dashboard
//         </li>

//         <li>
//           <FaUsers />
//           Employees
//         </li>

//         <li>
//           <FaBuilding />
//           Departments
//         </li>

//         <li>
//           <FaChartBar />
//           Reports
//         </li>

//         <li>
//           <FaCog />
//           Settings
//         </li>

//       </ul>

//       <button className="logout-btn">
//         <FaSignOutAlt />
//         Logout
//       </button>

//     </aside>
//   );
// }

// export default Sidebar;


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