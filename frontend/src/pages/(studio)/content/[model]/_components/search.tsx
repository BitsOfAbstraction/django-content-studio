import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import { useDebounce } from "react-use";

import { Input } from "@/components/ui/input";

export function Search() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [local, setLocal] = useState(searchParams.get("search") ?? "");

  useDebounce(
    () => {
      setSearchParams((searchParams) => {
        searchParams.set("search", local);
        return searchParams;
      });
    },
    300,
    [local],
  );

  return (
    <Input
      size="sm"
      className="w-[260px] shrink-0 max-w-full"
      placeholder={t("common.search")}
      value={local}
      onChange={(e) => {
        setLocal(e.target.value);
      }}
    />
  );
}
