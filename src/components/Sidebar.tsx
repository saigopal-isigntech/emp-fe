// function Sidebar() {
//   return (
//     <aside className="sidebar">
//       <h2>Menu</h2>

//       <ul>
//         <li>Dashboard</li>
//         <li>Employees</li>
//         <li>Settings</li>
//       </ul>
//     </aside>
//   );
// }

// export default Sidebar;

// import { NavLink } from "react-router-dom";
// import {
//   FaTachometerAlt,
//   FaUsers,
//   FaCog,
// } from "react-icons/fa";

// function Sidebar() {
//   return (
//     <aside className="sidebar">
//       <h2>Menu</h2>

//       <ul>
//         <li>
//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               isActive ? "active-link" : ""
//             }
//           >
//             <FaTachometerAlt /> Dashboard
//           </NavLink>
//         </li>

//         <li>
//           <NavLink
//             to="/employees"
//             className={({ isActive }) =>
//               isActive ? "active-link" : ""
//             }
//           >
//             <FaUsers /> Employee List
//           </NavLink>
//         </li>

//         <li>
//           <NavLink
//             to="/employees/101"
//             className={({ isActive }) =>
//               isActive ? "active-link" : ""
//             }
//           >
//             <FaCog /> Employee Details
//           </NavLink>
//         </li>
//       </ul>
//     </aside>
//   );
// }

// export default Sidebar;





// import { NavLink } from "react-router-dom";

// function Sidebar() {
//   return (
//     <aside className="sidebar">
//       <h2>Menu</h2>

//       <ul>
//         <li>
//           <NavLink to="/">Dashboard</NavLink>
//         </li>

//         <li>
//           <NavLink to="/employees">Employee List</NavLink>
//         </li>
//       </ul>
//     </aside>
//   );
// }

// export default Sidebar;









// import { NavLink } from "react-router-dom";

// function Sidebar() {
//   return (
//     <aside className="sidebar">
//       <h2 className="sidebar-title">Menu</h2>

//       <ul className="sidebar-menu">
//         <li>
//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               isActive ? "active-link" : ""
//             }
//           >
//             Dashboard
//           </NavLink>
//         </li>

//         <li>
//           <NavLink
//             to="/employees"
//             className={({ isActive }) =>
//               isActive ? "active-link" : ""
//             }
//           >
//             Employee List
//           </NavLink>
//         </li>
//       </ul>
//     </aside>
//   );
// }

// export default Sidebar;



import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menu</h2>

      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? "active-link" : ""
            }
          >
            Employee List
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;