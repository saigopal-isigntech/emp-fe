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