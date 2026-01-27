export function TextFormat({
  value,
  emptyValue,
}: {
  value: unknown;
  emptyValue?: string | null;
}) {
  return <span>{String(value || emptyValue || "")}</span>;
}
