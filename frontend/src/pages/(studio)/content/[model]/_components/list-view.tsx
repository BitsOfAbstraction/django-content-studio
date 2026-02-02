import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { FormatRenderer } from "@/components/formats/renderer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Model } from "@/types";

export function ListView({
  items,
  model,
}: {
  items: { id: string; [p: string]: unknown }[];
  model: Model;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fields = model.admin.list.display.filter(
    ({ name }) => !R.isNil(model.fields[name]),
  );

  return (
    <div className="relative border rounded-lg bg-white overflow-auto flex-1 scrollbar">
      <Table>
        <TableHeader>
          <TableRow>
            {model.admin.list.display.map(({ name, description }) => (
              <TableHead key={name} className="h-10 sticky top-0 z-10">
                {description ?? model.fields[name]?.verbose_name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {R.isEmpty(items) && (
            <TableRow>
              <TableCell
                colSpan={fields.length}
                className="text-center py-12 text-gray-700"
              >
                {t("list_view.empty_state")}
              </TableCell>
            </TableRow>
          )}
          {items.map((item) => (
            <TableRow
              key={item.id}
              onClick={() =>
                navigate({ hash: `#editor:${model.label}:${item.id}` })
              }
            >
              {fields.map(({ name, empty_value }) => (
                <TableCell key={name} className="h-14 first-of-type:pl-6">
                  <FormatRenderer
                    value={item[name]}
                    field={model.fields[name]}
                    emptyValue={empty_value}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
