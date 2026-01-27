import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as R from "ramda";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiFileTextBold } from "react-icons/pi";
import { Link, useParams, useSearchParams } from "react-router";

import { buttonVariants } from "@/components/ui/button.tsx";
import { Pagination } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { useDiscover } from "@/hooks/use-discover";
import { useHttp } from "@/hooks/use-http";
import { cn } from "@/lib/utils";
import type { PaginatedResponse, Resource } from "@/types";

import { Filters } from "./_components/filters";
import { ListView } from "./_components/list-view";

export function ModelListPage() {
  const { t } = useTranslation();
  const { model: appLabel } = useParams<{ model: string }>();
  const http = useHttp();
  const { data: discover } = useDiscover();
  const model = discover?.models.find(R.whereEq({ label: appLabel }));
  const [view, setView] = useState<"list" | "grid">("list");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const [filters, setFilters] = useState<{ search: string }>({
    search: "",
  });
  const { data } = useQuery({
    retry: false,
    enabled: !R.isNil(model),
    queryKey: ["resources", appLabel, filters, page],
    placeholderData: keepPreviousData,
    async queryFn() {
      const { data } = await http.get<PaginatedResponse<Resource>>(
        `/content/${appLabel}`,
        {
          params: {
            search: filters.search,
            filters: R.omit(["search"], filters),
            page,
          },
        },
      );

      return data;
    },
  });

  return model && data ? (
    <div className="p-6 flex flex-col overflow-hidden">
      <div className="flex items-center gap-4 mb-8">
        {model.admin.icon ? (
          <span
            className={cn(model.admin.icon, "text-xl text-muted-foreground")}
          />
        ) : (
          <PiFileTextBold />
        )}
        <div className="select-none flex-1">
          <h1 className="text-xl/tight font-semibold">
            {model.verbose_name_plural}
          </h1>
          {model.admin.list.description && (
            <div className="text-muted-foreground">
              {model.admin.list.description}
            </div>
          )}
        </div>
        {model.admin.permissions.add_permission && (
          <Link
            to={{ hash: `editor:${model.label}` }}
            className={buttonVariants()}
          >
            {t("common.create")}
          </Link>
        )}
      </div>

      <div className="mb-8">
        <Filters model={model} filters={filters} onFilterChange={setFilters} />
      </div>
      {view === "list" ? <ListView items={data.results} model={model} /> : null}
      <div className="py-6">
        <Pagination
          current={data.pagination.current}
          pages={data.pagination.pages}
          onPageChange={(page) =>
            setSearchParams((searchParams) => {
              searchParams.set("page", `${page}`);
              return searchParams;
            })
          }
        />
      </div>
    </div>
  ) : (
    <div className="flex-1 flex items-center justify-center">
      <Spinner />
    </div>
  );
}
