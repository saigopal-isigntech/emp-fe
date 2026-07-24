// function Header() {
//   return (
//     <header className="header">
//       <h1>Employee Management System</h1>
//     </header>
//   );
// }

// export default Header;
// function Header() {
//   return (
//     <header className="header">
//       <div className="logo">
//         <span className="logo-icon">👨‍💼</span>

//         <div>
//           <h1>Employee Management System</h1>
//           <p>HR Dashboard</p>
//         </div>
//       </div>

//       <div className="header-right">
//         <span>🔔</span>

//         <div className="admin-profile">
//           <div className="avatar">
//             SG
//           </div>

//           <div>
//             <h4>Admin</h4>
//             <small>Administrator</small>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;
import { FaBell, FaUserCircle } from "react-icons/fa";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h2>Employee Management System</h2>
      </div>

      <div className="header-right">
        <FaBell className="icon" />

        <div className="profile">
          <FaUserCircle className="profile-icon" />

          <div>
            <h4>Admin</h4>
            <small>HR Manager</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;