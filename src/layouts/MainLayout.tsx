// import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";

// function MainLayout() {
//   return (
//     <div className="app">
//       <Header />

//       <div className="main-layout">
//         <Sidebar />

//         <main className="dashboard">
//           <Outlet />
//         </main>
//       </div>

//       <footer
//         style={{
//           textAlign: "center",
//           padding: "15px",
//           background: "#fff",
//           borderTop: "1px solid #ddd",
//         }}
//       >
//         © 2026 Employee Management System
//       </footer>
//     </div>
//   );
// }

// export default MainLayout;






// import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";

// function MainLayout() {
//   return (
//     <div className="app">
//       <Header />

//       <div className="main-layout">
//         <Sidebar />

//         <main className="dashboard">
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
    <div className="app">
      <Header />

      <div className="main-layout">
        <Sidebar />

        <main className="dashboard">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;