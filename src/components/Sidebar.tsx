// import { NavLink } from "react-router-dom";

// function Sidebar() {
//   return (
//     <aside className="sidebar">
//       <h2 className="sidebar-title">Menu</h2>

//       <ul>
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


// import { NavLink } from "react-router-dom";

// function Sidebar() {
//   const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
//     `block rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
//       isActive
//         ? "bg-blue-600 text-white shadow"
//         : "text-slate-300 hover:bg-slate-700 hover:text-white"
//     }`;

//   return (
//     <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800">
//       <div className="p-6">
//         <h2 className="mb-6 text-lg font-bold text-white">
//           Menu
//         </h2>

//         <nav>
//           <ul className="space-y-2">
//             <li>
//               <NavLink
//                 to="/"
//                 end
//                 className={navLinkClasses}
//               >
//                 Dashboard
//               </NavLink>
//             </li>

//             <li>
//               <NavLink
//                 to="/employees"
//                 className={navLinkClasses}
//               >
//                 Employee List
//               </NavLink>
//             </li>
//           </ul>
//         </nav>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;





import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Employees",
      path: "/employees",
      icon: <FaUsers />,
    },
  ];

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 border-r bg-white lg:block">
      <div className="p-5">
        <h2 className="mb-6 text-lg font-bold text-slate-700">
          Navigation
        </h2>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;