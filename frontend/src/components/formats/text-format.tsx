export function TextFormat({ value }: { value: unknown }) {
  return <span className="text-sm">{String(value ?? "")}</span>;
}
