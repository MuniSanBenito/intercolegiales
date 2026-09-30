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
    children: [
      {
        index: true,
        lazy: () => import("./pages/(public)/page.tsx"),
      },
      {
        path: "login",
        lazy: () => import("./pages/(public)/login/page.tsx"),
      },
      {
        middleware: [authMiddleware],
        lazy: () => import("./pages/(protected)/layout.tsx"),
        children: [
          {
            path: "panel",
            lazy: () => import("./pages/(protected)/panel/layout.tsx"),
            children: [
              {
                index: true,
                lazy: () => import("./pages/(protected)/panel/page.tsx"),
              },
              {
                path: "resultados",
                lazy: () =>
                  import("./pages/(protected)/panel/resultados/page.tsx"),
              },
              {
                path: "disciplinas",
                lazy: () =>
                  import("./pages/(protected)/panel/disciplinas/page.tsx"),
              },
              {
                path: "equipos",
                lazy: () =>
                  import("./pages/(protected)/panel/equipos/page.tsx"),
              },
              {
                path: "escuelas",
                lazy: () =>
                  import("./pages/(protected)/panel/escuelas/page.tsx"),
              },
              {
                path: "torneos",
                children: [
                  {
                    index: true,
                    lazy: () =>
                      import("./pages/(protected)/panel/torneos/page.tsx"),
                  },
                  {
                    path: ":tournamentId",
                    lazy: () =>
                      import("./pages/(protected)/panel/torneos/[tournamentId]/page.tsx"),
                  },
                ],
              },
            ],
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
