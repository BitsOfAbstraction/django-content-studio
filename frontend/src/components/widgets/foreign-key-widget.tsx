import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as R from "ramda";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiChevronDown } from "react-icons/fi";

import { Input } from "@/components/ui/input.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { useHttp } from "@/hooks/use-http.ts";
import type { Model, Resource } from "@/types.ts";

export function ForeignKeyWidget({
  name,
  model,
  value,
  onChange,
}: {
  name: string;
  model: Model;
  onChange?: any;
  value?: any;
}) {
  const { t } = useTranslation();
  const http = useHttp();
  const form = useFormContext();
  const formValues = form.watch();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { data = [] } = useQuery({
    enabled: open,
    queryKey: ["related-model", model.label, name, formValues, search],
    placeholderData: keepPreviousData,
    async queryFn() {
      const { data } = await http.post<Resource[]>(
        `/content/${model.label}/relations/${name}`,
        { search, form: formValues },
      );

      return data;
    },
  });
  const dataWithValue = useMemo<Resource[]>(
    () =>
      R.pipe(
        R.unless(() => R.isNil(value) || !R.isEmpty(search), R.prepend(value)),
        R.uniqBy(R.prop("id")),
      )(data),
    [data, value, search],
  );

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-[240px] flex items-center justify-between text-left border hover:border-gray-300 rounded-md px-3 h-9 select-none">
        <div className="flex-1">{value?.__str__}</div>
        <FiChevronDown className="size-4 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="max-h-[400px] w-[var(--radix-popover-trigger-width)] overflow-hidden p-0 flex flex-col">
        <div className="p-2 border-b">
          <Input
            autoFocus
            placeholder={t("common.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-y-auto scrollbar p-2">
          {dataWithValue.map(({ id, __str__ }) => (
            <button
              key={id}
              className="flex text-left focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
              onClick={() => {
                onChange?.({ id, __str__ });
                setOpen(false);
              }}
            >
              <div className="line-clamp-1">{__str__}</div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
