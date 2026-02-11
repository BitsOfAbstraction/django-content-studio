"use client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateString } from "@/types";

dayjs.extend(localizedFormat);

export function DateWidget({
  value,
  onChange,
}: {
  value?: DateString;
  onChange?: any;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const date$ = React.useMemo(
    () => (value ? dayjs(value, "YYYY-MM-DD") : null),
    [value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="h-8 border border-gray-300 hover:border-gray-400 px-3 rounded-md shadow-xs cursor-pointer data-[state=open]:border-gray-400 flex items-center select-none">
        <div className="flex-1 text-left">
          {date$ ? (
            date$.format("ll")
          ) : (
            <span className="text-muted-foreground">
              {t("widgets.date_picker.placeholder")}
            </span>
          )}
        </div>
        <ChevronDownIcon className="size-4 text-muted-foreground/50" />
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          fixedWeeks
          defaultMonth={date$?.toDate()}
          selected={date$?.toDate()}
          onSelect={(date) => {
            if (date) {
              onChange?.(dayjs(date).format("YYYY-MM-DD"));
            }
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
