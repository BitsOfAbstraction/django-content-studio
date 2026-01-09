import * as R from "ramda";
import { useMemo } from "react";

import { useAdminInfo } from "@/hooks/use-admin-info";
import { FieldWidget, type Model } from "@/types";

import { MultiSelectFilter } from "./multi-select-filter";

export function FilterRenderer({
  fieldName,
  model,
  value,
  onValueChange,
}: {
  fieldName: string;
  model: Model;
  value: unknown;
  onValueChange(value: unknown): void;
}) {
  const { data: info } = useAdminInfo();
  const field = model.fields[fieldName];
  const widgetClass =
    field.widget_class ?? info?.widgets[field.type]?.name ?? null;

  const FilterComp = useMemo(
    () =>
      R.cond([
        [R.equals(FieldWidget.MultiSelectWidget), R.always(MultiSelectFilter)],
        [R.T, R.always(null)],
      ])(widgetClass),
    [widgetClass],
  );

  return (
    FilterComp && (
      <FilterComp value={value} onChange={onValueChange} field={field} />
    )
  );
}
