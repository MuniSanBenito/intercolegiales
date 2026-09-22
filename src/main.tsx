import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PageLoader } from "./components/PageLoader";
import "./index.css";

const router = createBrowserRouter([
  {
    hydrateFallbackElement: <PageLoader />,
    errorElement: <div>Error!</div>,
    loader: async () => {
      const name = await fetch("/api/")
        .then((res) => res.json() as Promise<{ name: string }>)
        .then((data) => data.name)
        .catch(() => "Error");
      console.log("name haciendo fetch al worker desde main layout", name);
    },
    children: [
      {
        path: "/",
        lazy: () => import("./pages/(public)/page.tsx"),
      },
      {
        path: "/login",
        lazy: () => import("./pages/(public)/login/page.tsx"),
      },
      {
        lazy: () => import("./pages/(protected)/layout.tsx"),
        children: [
          {
            path: "/panel",
            lazy: () => import("./pages/(protected)/panel/page.tsx"),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
