import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";

export function Filters({
  filters,
  onFilterChange,
}: {
  filters: { search: string };
  onFilterChange(filters: { search: string }): void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Input
        value={filters.search}
        onChange={(e) => onFilterChange({ search: e.target.value })}
        placeholder={t("common.search")}
      />
    </div>
  );
}
