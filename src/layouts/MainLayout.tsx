import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile sidebar when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 antialiased selection:bg-indigo-500 selection:text-white flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
      />
      <div className="flex flex-1 pt-16">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="w-full min-w-0 flex-1 px-3 py-5 sm:px-6 lg:ml-64 lg:px-8">
          <div className="mx-auto max-w-6xl pb-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
