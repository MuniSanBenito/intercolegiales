import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PageLoader } from "./components/PageLoader";
import "./index.css";

const router = createBrowserRouter([
  {
    hydrateFallbackElement: <PageLoader />,
    errorElement: <div>Error!</div>,
    path: "/",
    lazy: () => import("./pages/(public)/page.tsx"),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
