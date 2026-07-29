
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaBuilding,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";


interface DashboardHeaderProps {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departments: number;
  openForm: () => void;
}

function DashboardHeader({
  totalEmployees,
  activeEmployees,
  inactiveEmployees,
  departments,
  openForm,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  return (
    <>
      {/* Welcome Section */}
      <div className="welcome-section">
        <div>
          <h2>Welcome Back 👋</h2>
          <p>Manage your employees efficiently from one place.</p>
        </div>

        {/* <button className="add-btn" onClick={openForm}>
          + Add Employee
        </button> */}
        {/* <button
      className="add-btn"
      onClick={() => navigate("/employees")}
    >
      + Add Employee
    </button> */}
    <button
  className="add-btn"
  onClick={() => navigate("/employees")}
>
  + Add Employee
</button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaUsers />
          </div>

          <div>
            <h3>{totalEmployees}</h3>
            <p>Total Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaUserCheck />
          </div>

          <div>
            <h3>{activeEmployees}</h3>
            <p>Active Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaUserTimes />
          </div>

          <div>
            <h3>{inactiveEmployees}</h3>
            <p>Inactive Employees</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaBuilding />
          </div>

          <div>
            <h3>{departments}</h3>
            <p>Departments</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;