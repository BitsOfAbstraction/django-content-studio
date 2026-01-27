import * as R from "ramda";
import { useMemo } from "react";

import { useAdminInfo } from "@/hooks/use-admin-info";
import { FieldFormat, type ModelField } from "@/types";

import { BooleanFormat } from "./boolean-format";
import { ChoiceFormat } from "./choice-format";
import { DateFormat } from "./date-format";
import { DatetimeFormat } from "./datetime-format";
import { FileFormat } from "./file-format";
import { FileSizeFormat } from "./file-size-format";
import { ForeignKeyFormat } from "./foreign-key-format";
import { JSONFormat } from "./json-format";
import { MediaFormat } from "./media-format";
import { TextFormat } from "./text-format";
import { TimeFormat } from "./time-format";

export function FormatRenderer({
  value,
  field,
  emptyValue,
}: {
  value: unknown;
  field?: ModelField;
  emptyValue?: string | null;
}) {
  const { data: info } = useAdminInfo();
  const formatClass =
    field?.format_class ??
    info?.formats[field?.type]?.name ??
    FieldFormat.TextFormat;

  const FormatComp = useMemo(
    () =>
      R.cond([
        [R.isNil, R.always(TextFormat)],
        [() => !R.isNil(field?.choices), R.always(ChoiceFormat)],
        [R.equals(FieldFormat.FileSizeFormat), R.always(FileSizeFormat)],
        [R.equals(FieldFormat.FileFormat), R.always(FileFormat)],
        [R.equals(FieldFormat.BooleanFormat), R.always(BooleanFormat)],
        [R.equals(FieldFormat.TimeFormat), R.always(TimeFormat)],
        [R.equals(FieldFormat.DateFormat), R.always(DateFormat)],
        [R.equals(FieldFormat.DateTimeFormat), R.always(DatetimeFormat)],
        [R.equals(FieldFormat.ForeignKeyFormat), R.always(ForeignKeyFormat)],
        [R.equals(FieldFormat.MediaFormat), R.always(MediaFormat)],
        [R.equals(FieldFormat.JSONFormat), R.always(JSONFormat)],
        [R.T, R.always(TextFormat)],
      ])(formatClass),
    [field?.choices, field?.type, formatClass],
  );

  return <FormatComp value={value} field={field} emptyValue={emptyValue} />;
}
