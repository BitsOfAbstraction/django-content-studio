import * as R from "ramda";
import { useMemo } from "react";

import { useAdminInfo } from "@/hooks/use-admin-info";
import { FieldWidget, type ModelField } from "@/types";

import { MultiSelectFilter } from "./multi-select-filter";

export function FilterRenderer({
  field,
  value,
  onValueChange,
}: {
  field: ModelField;
  value: string;
  onValueChange(value: string): void;
}) {
  const { data: info } = useAdminInfo();
  const widgetClass = field.widget_class ?? info?.widgets[field.type]?.name;

  const FilterComp = useMemo(
    () =>
      R.cond([
        [
          () =>
            widgetClass === FieldWidget.InputWidget && !R.isNil(field.choices),
          R.always(MultiSelectFilter),
        ],
        [R.equals(FieldWidget.MultiSelectWidget), R.always(MultiSelectFilter)],
        [R.T, R.always(null)],
      ])(widgetClass),
    [field.choices, widgetClass],
  );

  return (
    FilterComp && (
      <FilterComp value={value} onChange={onValueChange} field={field} />
    )
  );
}
