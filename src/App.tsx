import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetails from "./pages/EmployeeDetails";
import DepartmentsPage from "./pages/DepartmentsPage";
import AttendanceLeavePage from "./pages/AttendanceLeavePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/PageNotFound";
import { useAuth } from "./context/AuthContext";

// Redirects to /login if not authenticated
function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center text-slate-700 text-xs font-bold">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-[#4f46e5] border-t-transparent animate-spin"></div>
          <span>Loading session...</span>
        </div>
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
      {/* Public routes - Unique Sign In & Registration URLs */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />

      {/* Protected routes - Unique functional module URLs */}
      <Route element={<ProtectedLayout />}>
        {/* Dashboard endpoints */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* User Profile */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Separate Dedicated URLs for Attendance & Leaves */}
        <Route path="/attendance" element={<AttendanceLeavePage />} />
        <Route path="/leaves" element={<AttendanceLeavePage />} />

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
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
