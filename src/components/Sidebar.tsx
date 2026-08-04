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





// import { NavLink } from "react-router-dom";
// import {
//   FaHome,
//   FaUsers,
// } from "react-icons/fa";

// function Sidebar() {
//   const menuItems = [
//     {
//       name: "Dashboard",
//       path: "/",
//       icon: <FaHome />,
//     },
//     {
//       name: "Employees",
//       path: "/employees",
//       icon: <FaUsers />,
//     },
//   ];

//   return (
//     <aside className="fixed left-0 top-16 hidden h-[calc(100vh-64px)] w-64 border-r bg-white lg:block">
//       <div className="p-5">
//         <h2 className="mb-6 text-lg font-bold text-slate-700">
//           Navigation
//         </h2>

//         <nav className="space-y-2">
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "/"}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
//                   isActive
//                     ? "bg-blue-600 text-white shadow"
//                     : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
//                 }`
//               }
//             >
//               <span className="text-lg">
//                 {item.icon}
//               </span>

//               <span className="font-medium">
//                 {item.name}
//               </span>
//             </NavLink>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;



import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaUserTie } from "react-icons/fa";

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
    <aside className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 overflow-y-auto border-r border-slate-200 bg-white shadow-md">
      {/* Logo */}
      <div className="border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <FaUserTie className="text-2xl" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Employee MS
            </h2>

            <p className="text-sm text-slate-500">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-6">
        <h3 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </h3>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full px-6">
        <div className="rounded-xl bg-slate-100 p-4 text-center">
          <p className="text-xs text-slate-500">
            Employee Management System
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            Version 1.0
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;