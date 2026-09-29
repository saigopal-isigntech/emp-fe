import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <div className="flex flex-col pt-14 lg:flex-row">
        <Sidebar />
        <main className="w-full min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-56 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
