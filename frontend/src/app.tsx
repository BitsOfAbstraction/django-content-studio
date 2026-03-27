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
import { LoadingBar } from "@/components/loading-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/sonner";
import { useAdminInfo } from "@/hooks/use-admin-info";

import packageJson from "../package.json";

export function App() {
  const { t, i18n } = useTranslation();
  const { isError, error } = useAdminInfo();

  useEffect(() => {
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  return (
    <>
      <LoadingBar />
      <ConfirmDialogProvider>
        {isError ? (
          <div className="min-h-screen bg-accent flex items-center justify-center p-4">
            <div className="w-full max-w-md flex flex-col gap-3 items-center animate-in fade-in-0 slide-in-from-bottom-20 duration-500">
              <Alert variant="destructive" className="max-w-lg">
                <AlertTitle>{t("app.error")}</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
              <div className="text-muted-foreground text-sm text-center cursor-default">
                {`Django Content Studio v${packageJson.version}`}
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </ConfirmDialogProvider>
      <Toaster />
    </>
  );
}
