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



// import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";

// function MainLayout() {
//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* Header */}
//       <Header />

//       {/* Body */}
//       <div className="flex">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content */}
//         <main className="flex-1 p-6 lg:ml-64 mt-16">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default MainLayout;




// import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";

// function MainLayout() {
//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* Fixed Header */}
//       <Header />

//       {/* Main Layout */}
//       <div className="flex pt-16">
//         {/* Fixed Sidebar */}
//         <Sidebar />

//         {/* Page Content */}
//         <main className="flex-1 ml-64 p-6 overflow-auto">
//           <div className="max-w-7xl mx-auto">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default MainLayout;



// import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";

// function MainLayout() {
//   return (
//     <div className="min-h-screen bg-slate-100">
//       <Header />

//       <div className="pt-16 flex">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content */}
//         <main className="flex-1 lg:ml-64 p-6 overflow-x-hidden">
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
      <Header />

      <div className="flex pt-16">
        <Sidebar />

        <main className="ml-64 flex-1 overflow-x-hidden p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;