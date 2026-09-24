import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PageLoader } from "./components/PageLoader";
import "./index.css";
import { authMiddleware } from "./middlewares/auth.ts";

const router = createBrowserRouter([
  {
    hydrateFallbackElement: <PageLoader />,
    errorElement: <div>Error!</div>,
    loader: async () => {
      const name = await fetch("/api/hello")
        .then((res) => res.json() as Promise<{ message: string }>)
        .then((data) => data.message)
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
        middleware: [authMiddleware],
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
