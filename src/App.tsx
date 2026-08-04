// import { Routes, Route } from "react-router-dom";

// import MainLayout from "./layouts/MainLayout";
// import Dashboard from "./pages/Dashboard";
// import EmployeeListPage from "./pages/EmployeeListPage";
// import EmployeeDetails from "./pages/EmployeeDetails";
// import PageNotFound from "./pages/PageNotFound";

// import "./App.css";

// function App() {
//   return (
//     <Routes>
//       <Route element={<MainLayout />}>
//         <Route path="/" element={<Dashboard />} />

//         <Route
//           path="/employees"
//           element={<EmployeeListPage />}
//         />

//         <Route
//           path="/employees/:id"
//           element={<EmployeeDetails />}
//         />
//       </Route>

//       <Route path="*" element={<PageNotFound />} />
//     </Routes>
//   );
// }

// export default App;



import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeListPage from "./pages/EmployeeListPage";
import EmployeeDetails from "./pages/EmployeeDetails";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/employees"
          element={<EmployeeListPage />}
        />
        <Route
          path="/employees/:id"
          element={<EmployeeDetails />}
        />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;