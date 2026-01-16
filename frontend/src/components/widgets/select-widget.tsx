import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ModelField } from "@/types";

export function SelectWidget({
  field,
  value,
  onChange,
}: {
  field: ModelField;
  onChange(value: any): void;
  value?: any;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-auto">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {field.choices?.map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
