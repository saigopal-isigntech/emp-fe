// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import "./index.css";
// import App from "./App";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// );


// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { EmployeeProvider } from "./context/EmployeeContext";

// import "./index.css";
// import App from "./App";

// const queryClient = new QueryClient();

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <EmployeeProvider>
//         <BrowserRouter>
//           <App />
//         </BrowserRouter>
//       </EmployeeProvider>
//     </QueryClientProvider>
//   </StrictMode>
// );


// 




import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import App from "./App";
import { EmployeeProvider } from "./context/EmployeeContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <EmployeeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </EmployeeProvider>
    </QueryClientProvider>
  </StrictMode>
);