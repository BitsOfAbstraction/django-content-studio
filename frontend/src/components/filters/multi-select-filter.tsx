import * as R from "ramda";

import { MultiSelect } from "@/components/ui/multi-select";
import type { ModelField } from "@/types";

export function MultiSelectFilter({
  field,
  value = [],
  onChange,
}: {
  field: ModelField;
  onChange(value: any): void;
  value?: any;
}) {
  const options = R.fromPairs(field.choices ?? []);

  return (
    <MultiSelect
      hidePlaceholderWhenSelected
      options={
        field.choices?.map(([value, label]) => ({
          label,
          value,
        })) ?? []
      }
      value={value.map((value: string) => ({ value, label: options[value] }))}
      onChange={(options) => onChange(options.map(R.prop("value")))}
    />
  );
}
