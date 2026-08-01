import DashboardHeader from "../components/DashboardHeader";
import { useEmployeeContext } from "../context/EmployeeContext";

function Dashboard() {
  const { employees } = useEmployeeContext();

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (emp) => emp.status === "Inactive"
  ).length;

  const departments = new Set(
    employees.map((emp) => emp.department)
  ).size;

  return (
    <>
      <DashboardHeader
        totalEmployees={totalEmployees}
        activeEmployees={activeEmployees}
        inactiveEmployees={inactiveEmployees}
        departments={departments}
        openForm={() => {}}
      />

      <div
        style={{
          marginTop: "40px",
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)",
        }}
      >
        <h2>Dashboard Overview</h2>

        <br />

        <p>
          Welcome to the Employee Management System.
        </p>

        <br />

        <p>
          Use the sidebar to navigate between Dashboard and Employee List.
        </p>
      </div>
    </>
  );
}

export default Dashboard;