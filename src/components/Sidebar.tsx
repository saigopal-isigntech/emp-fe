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