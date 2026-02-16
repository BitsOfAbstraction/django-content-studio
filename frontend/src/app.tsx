import "@fontsource-variable/inter";
import "./index.css";
import "./i18n";
// Dayjs locales
import "dayjs/locale/en";
import "dayjs/locale/nl";
import "dayjs/locale/fr";
import "dayjs/locale/de";

import { useIsFetching } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

import { ConfirmDialogProvider } from "@/components/confirm-dialog-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/sonner";
import { useAdminInfo } from "@/hooks/use-admin-info";

export function App() {
  const { t, i18n } = useTranslation();
  const { isError, error } = useAdminInfo();
  const ref = useRef<LoadingBarRef>(null);
  const isFetching = useIsFetching();

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    if (isFetching > 0) {
      ref.current?.start();
    } else {
      ref.current?.complete();
    }
  }, [isFetching]);

  return (
    <>
      <LoadingBar ref={ref} color="#1E2938" shadow={false} />
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
