import "./index.css";
import "./i18n";
// Dayjs locales
import "dayjs/locale/en";
import "dayjs/locale/nl";
import "dayjs/locale/fr";
import "dayjs/locale/de";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";

import { ConfirmDialogProvider } from "@/components/confirm-dialog-provider";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmDialogProvider>
        <Outlet />
      </ConfirmDialogProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
