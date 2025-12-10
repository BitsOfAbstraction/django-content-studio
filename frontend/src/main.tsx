import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import { App } from "@/app";
import { AuthGuard, AuthProvider } from "@/auth";
import { AuthLayout } from "@/pages/(auth)/layout";
import { LoginPage } from "@/pages/(auth)/login/page";
import { DashboardPage } from "@/pages/(studio)/(dashboard)/page";
import { ModelListLayout } from "@/pages/(studio)/content/[model]/layout";
import { ModelListPage } from "@/pages/(studio)/content/[model]/page";
import { StudioLayout } from "@/pages/(studio)/layout";
import { MediaLibraryPage } from "@/pages/(studio)/media-library/[model]/page";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          element: <AuthGuard />,
          children: [
            {
              element: <StudioLayout />,
              children: [
                {
                  index: true,
                  element: <DashboardPage />,
                },
                {
                  path: "media-library",
                  element: <MediaLibraryPage />,
                },
                {
                  path: "content/:model",
                  element: <ModelListLayout />,
                  children: [
                    {
                      index: true,
                      element: <ModelListPage />,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          element: <AuthLayout />,
          children: [
            {
              path: "login",
              element: <LoginPage />,
            },
          ],
        },
      ],
    },
  ],
  { basename: import.meta.env.PROD && (window as any).DCS_BASENAME },
);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
