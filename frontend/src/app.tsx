import "./index.css";
import "./i18n";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router";

import { ConfirmDialogProvider } from "@/components/confirm-dialog-provider";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmDialogProvider>
        <Outlet />
      </ConfirmDialogProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
