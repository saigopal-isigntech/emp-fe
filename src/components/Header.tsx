// import { FaBell, FaUserCircle } from "react-icons/fa";

// function Header() {
//   return (
//     <header className="header">
//       <div className="logo">
//         <h2>Employee Management System</h2>
//       </div>

//       <div className="header-right">
//         <FaBell className="icon" />

//         <div className="profile">
//           <FaUserCircle className="profile-icon" />

//           <div>
//             <h4>Admin</h4>
//             <small>HR Manager</small>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;



// import { FaBell, FaUserCircle } from "react-icons/fa";

// function Header() {
//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
//       {/* Logo */}
//       <div>
//         <h2 className="text-xl font-bold text-slate-800">
//           Employee Management System
//         </h2>
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-6">
//         {/* Notification */}
//         <button
//           className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
//           aria-label="Notifications"
//         >
//           <FaBell className="text-xl" />
//         </button>

//         {/* Profile */}
//         <div className="flex items-center gap-3">
//           <FaUserCircle className="text-4xl text-slate-600" />

//           <div>
//             <h4 className="text-sm font-semibold text-slate-800">
//               Admin
//             </h4>

//             <p className="text-xs text-slate-500">
//               HR Manager
//             </p>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;


// import { FaBell, FaUserCircle } from "react-icons/fa";

// function Header() {
//   return (
//     <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white shadow-sm">
//       <div className="mx-auto flex h-full items-center justify-between px-6">
//         {/* Logo */}
//         <div>
//           <h1 className="text-xl font-bold text-slate-800">
//             Employee Management System
//           </h1>
//           <p className="hidden text-sm text-slate-500 md:block">
//             HR Dashboard
//           </p>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-6">
//           {/* Notification */}
//           <button className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600">
//             <FaBell size={20} />
//           </button>

//           {/* Profile */}
//           <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
//             <FaUserCircle className="text-3xl text-blue-600" />

//             <div className="hidden md:block">
//               <h4 className="text-sm font-semibold text-slate-800">
//                 Admin
//               </h4>

//               <p className="text-xs text-slate-500">
//                 HR Manager
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;




import { FaBell, FaChevronDown, FaUserCircle } from "react-icons/fa";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Employee Management System
          </h1>
          <p className="text-sm text-slate-500">
            HR Dashboard
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Notification */}
          <button className="relative rounded-full p-2 transition hover:bg-slate-100">
            <FaBell className="text-xl text-slate-600" />

            {/* Notification Dot */}
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <FaUserCircle className="text-4xl text-blue-600" />

            <div className="hidden sm:block">
              <h3 className="text-sm font-semibold text-slate-800">
                Admin
              </h3>

              <p className="text-xs text-slate-500">
                HR Manager
              </p>
            </div>

            <FaChevronDown className="hidden text-xs text-slate-500 sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;