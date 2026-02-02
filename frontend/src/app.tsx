import "./index.css";
import "./i18n";
// Dayjs locales
import "dayjs/locale/en";
import "dayjs/locale/nl";
import "dayjs/locale/fr";
import "dayjs/locale/de";

import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";

import { ConfirmDialogProvider } from "@/components/confirm-dialog-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import { Toaster } from "@/components/ui/sonner";
import { useAdminInfo } from "@/hooks/use-admin-info.ts";

export function App() {
  const { t, i18n } = useTranslation();
  const { isError, error } = useAdminInfo();

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  return (
    <>
      <ConfirmDialogProvider>
        {isError ? (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center  p-4">
            <Alert variant="destructive" className="max-w-lg">
              <AlertTitle>{t("app.error")}</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          </div>
        ) : (
          <Outlet />
        )}
      </ConfirmDialogProvider>
      <Toaster />
    </>
  );
}
