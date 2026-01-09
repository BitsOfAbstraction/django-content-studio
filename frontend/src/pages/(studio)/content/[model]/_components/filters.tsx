import { useTranslation } from "react-i18next";

import { FilterRenderer } from "@/components/filters/renderer";
import { Input } from "@/components/ui/input";
import type { Model } from "@/types";

export function Filters({
  model,
  filters,
  onFilterChange,
}: {
  model: Model;
  filters: { search: string; [p: string]: unknown };
  onFilterChange(filters: { search: string; [p: string]: unknown }): void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4">
      {model.admin.list.search && (
        <Input
          variant="secondary"
          className="w-[260px] max-w-full"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder={t("common.search")}
        />
      )}
      {false &&
        model.admin.list.filter?.map((filter) => (
          <FilterRenderer
            fieldName={filter}
            model={model}
            value={filters[filter]}
            onValueChange={(value) =>
              onFilterChange({ ...filters, [filter]: value })
            }
          />
        ))}
    </div>
  );
}
