import { Badge } from "@/components/ui/badge";
import type { ModelField } from "@/types";

export function ChoiceFormat({
  value,
  field,
}: {
  value: unknown;
  field: ModelField;
}) {
  const label = field.choices?.find(([key]) => value === key)?.[1];

  return <Badge variant="secondary">{label || String(value)}</Badge>;
}
