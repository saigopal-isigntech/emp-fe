import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetails from "./pages/EmployeeDetails";
import DepartmentsPage from "./pages/DepartmentsPage";
import AttendanceLeavePage from "./pages/AttendanceLeavePage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import { useAuth } from "./context/AuthContext";

// Redirects to /login if not authenticated
function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
}

// Blocks access to admin/HR-only pages for EMPLOYEE role
function AdminHrRoute({ children }: { children: React.ReactNode }) {
  const { currentRole } = useAuth();
  const isAdminOrHr = currentRole === "ADMIN" || currentRole === "HR";
  if (!isAdminOrHr) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Public route — Login & Register */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes — require authentication */}
      <Route element={<ProtectedLayout />}>
        {/* All roles can access Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* ADMIN and HR only */}
        <Route
          path="/employees"
          element={
            <AdminHrRoute>
              <EmployeeListPage />
            </AdminHrRoute>
          }
        />
        <Route
          path="/employees/:id"
          element={
            <AdminHrRoute>
              <EmployeeDetails />
            </AdminHrRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <AdminHrRoute>
              <DepartmentsPage />
            </AdminHrRoute>
          }
        />

        {/* All roles can access Attendance & Leave */}
        <Route path="/attendance" element={<AttendanceLeavePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
