import { useMutation } from "@tanstack/react-query";
import {
  LucideEye,
  LucideEyeOff,
  LucideLock,
  LucideMail,
  LucideUser,
} from "lucide-react";
import * as R from "ramda";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";

import { useAuth } from "@/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHttp } from "@/hooks/use-http";
import { getErrorMessage } from "@/lib/utils";
import { FieldType, type UsernamePasswordBackend } from "@/types";

export function UsernamePasswordBackend({
  config,
}: {
  config: UsernamePasswordBackend["config"];
}) {
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const http = useHttp();
  const { setToken } = useAuth();
  const [searchParams] = useSearchParams();
  const { mutate, isPending, error } = useMutation({
    async mutationFn(credentials: { username: string; password: string }) {
      try {
        const { data } = await http.post<{ refresh: string; access: string }>(
          "/login/usernamepassword",
          credentials,
        );
        setToken(data.access);
        location.href = searchParams.get("redirect") ?? "/";
      } catch (e: unknown) {
        throw new Error(getErrorMessage(e));
      }
    },
  });
  const emailField = config.username_field_type === FieldType.EmailField;

  return (
    <div className="w-full max-w-md flex-1 flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold text-gray-700 text-center">
        {t("login.title")}
      </h1>
      <div className="text-gray-500 text-center mb-12">
        {t("login.subtitle")}
      </div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="justify-center">
            {error.message}
          </AlertDescription>
        </Alert>
      )}
      <form className="border border-gray-300 rounded-lg bg-background p-4 w-full shadow-sm shadow-gray-900/5">
        <div className="relative flex items-center mb-4">
          {emailField ? (
            <LucideMail className="size-4 stroke-gray-400 absolute left-3" />
          ) : (
            <LucideUser className="size-4 stroke-gray-400 absolute left-3" />
          )}
          <Input
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            type={emailField ? "email" : "text"}
            placeholder={
              emailField
                ? t("login.email_placeholder")
                : t("login.username_placeholder")
            }
            className="px-9"
            disabled={isPending}
          />
        </div>
        <div className="relative flex items-center mb-6">
          <LucideLock className="size-4 stroke-gray-400 absolute left-3" />
          <Input
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                mutate(credentials);
              }
            }}
            type={passwordVisible ? "text" : "password"}
            placeholder={t("login.password_placeholder")}
            className="px-9"
            disabled={isPending}
          />
          <button
            className="z-10 absolute right-3 hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setPasswordVisible(R.not);
            }}
          >
            {passwordVisible ? (
              <LucideEyeOff className="size-4 stroke-gray-600" />
            ) : (
              <LucideEye className="size-4 stroke-gray-600" />
            )}
          </button>
        </div>
        <div className="mb-4">
          <Label>
            <Checkbox />
            {t("login.remember_me")}
          </Label>
        </div>
        <Button
          className="w-full mb-2"
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault();
            mutate(credentials);
          }}
        >
          {t("login.submit")}
        </Button>
        <div className="text-center">
          <Link to="/forgot-password" className="text-sm hover:underline">
            {t("login.forgot_password")}
          </Link>
        </div>
      </form>
      <div className="text-center text-sm text-gray-400 mt-4">
        {t("login.no_account")}
      </div>
    </div>
  );
}
