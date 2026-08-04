// // import { Outlet } from "react-router-dom";
// // import Header from "../components/Header";
// // import Sidebar from "../components/Sidebar";

// // function MainLayout() {
// //   return (
// //     <div className="app">
// //       <Header />

// //       <div className="main-layout">
// //         <Sidebar />

// //         <main className="dashboard">
// //           <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

// // export default MainLayout;

// import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";

// function MainLayout() {
//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* Fixed Header */}
//       <Header />

//       {/* Sidebar + Main Content */}
//       <div className="pt-16">
//         <Sidebar />

//         <main className="ml-64 min-h-[calc(100vh-4rem)] p-8">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default MainLayout;



import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <Header />

      {/* Body */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-64 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;