import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function URLPathWidget({
  value = "",
  onChange,
}: {
  onChange(value: any): void;
  value?: any;
}) {
  return (
    <div>
      <InputGroup>
        <InputGroupAddon>{"/"}</InputGroupAddon>
        <InputGroupInput
          value={value?.replace(/^\//, "") ?? ""}
          onChange={(e) =>
            onChange(
              `/${e.target.value.toLowerCase().replace(/[^0-9a-z_/-]/g, "-")}`,
            )
          }
        />
      </InputGroup>
    </div>
  );
}
