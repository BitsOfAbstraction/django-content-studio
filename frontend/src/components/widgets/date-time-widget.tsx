"use client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimeWidget } from "@/components/widgets/time-widget.tsx";
import type { DateString } from "@/types";

dayjs.extend(localizedFormat);

export function DateTimeWidget({
  value,
  onChange,
}: {
  value?: DateString;
  onChange?: any;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const date$ = React.useMemo(
    () => (value ? dayjs(value, "YYYY-MM-DD HH:mm") : null),
    [value],
  );
  const [time, setTime] = useState(date$?.format("HH:mm") ?? "");
  const [date, setDate] = useState(date$?.toDate() ?? undefined);

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          onChange?.(`${dayjs(date).format("YYYY-MM-DD")}T${time ?? "00:00"}`);
        }
      }}
    >
      <PopoverTrigger className="h-8 shadow-xs border border-gray-300 hover:border-gray-400 px-3 rounded-md flex items-center select-none cursor-pointer">
        <div className="flex-1 text-left">
          {date$ ? (
            <span className="text-gray-700 font-medium">
              {date$.format("ll LT")}
            </span>
          ) : (
            <span className="text-gray-400">
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
          selected={date}
          onSelect={(date) => {
            if (date) {
              setDate(date);
            }
          }}
        />
        <div className="p-3 border-t">
          <TimeWidget value={time} onChange={setTime} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
