import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PiPlus } from "react-icons/pi";

import { FormatRenderer } from "@/components/formats/renderer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHttp } from "@/hooks/use-http";
import { cn } from "@/lib/utils";
import type { Id, Model, PaginatedResponse, Resource } from "@/types";

import { Editor } from "./editor";

export function Inline({
  relModel,
  relId,
  model,
  adminModel,
}: {
  // Related model label
  relModel: string;
  // Related resource id
  relId: Id;
  // Inline model
  model: Model;
  // Inline admin model
  adminModel: { fk_name: string; list_display: string[] | null };
}) {
  const { t } = useTranslation();
  const http = useHttp();
  const [create, setCreate] = useState(false);
  const [page, setPage] = useState(1);
  const readOnly = !model.admin;
  const relName = useWatch({ name: "__str__" });
  const { data } = useQuery({
    retry: false,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    queryKey: [
      "resources",
      relModel,
      model.label,
      adminModel.fk_name,
      relId,
      page,
    ],
    async queryFn() {
      const { data } = await http.get<PaginatedResponse<Resource>>(
        `/inlines/${relModel}/${model.label}`,
        {
          params: { [`${adminModel.fk_name}_id`]: relId, page },
        },
      );

      return data;
    },
  });

  return (
    <div className="space-y-4">
      <Dialog open={create} onOpenChange={setCreate}>
        <DialogContent
          className="p-0 sm:max-w-5xl max-h-[calc(100vh-24px)] flex flex-col scrollbar"
          showCloseButton={false}
        >
          <Editor
            modelLabel={model.label}
            initialValues={{
              [adminModel.fk_name]: { id: relId, __str__: relName },
            }}
            onSave={() => setCreate(false)}
            onClose={() => setCreate(false)}
          />
        </DialogContent>
      </Dialog>
      <div className="border rounded-lg scrollbar">
        <Table>
          <TableHeader>
            <TableRow>
              {adminModel.list_display?.map((field) => (
                <TableHead key={field}>
                  <div className="flex items-center">
                    {model.fields[field]?.verbose_name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results.map((resource) => (
              <InlineRow
                key={resource.id}
                resource={resource}
                model={model}
                adminModel={adminModel}
                relId={relId}
                relName={relName}
                readOnly={readOnly}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {data?.pagination && (
        <div className="flex justify-center">
          <Pagination
            current={data.pagination.current}
            pages={data.pagination.pages}
            onPageChange={setPage}
          />
        </div>
      )}

      <div className="flex justify-center">
        <Button size="sm" variant="outline" onClick={() => setCreate(true)}>
          <PiPlus />
          {t("common.create")}
        </Button>
      </div>
    </div>
  );
}

function InlineRow({
  resource,
  readOnly,
  model,
  adminModel,
  relId,
  relName,
}: {
  relId: Id;
  relName: string;
  resource: Resource;
  readOnly: boolean;
  model: Model;
  adminModel: { fk_name: string; list_display: string[] | null };
}) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <Dialog key={resource.id} open={edit} onOpenChange={setEdit}>
        {!readOnly && (
          <DialogContent
            className="p-0 sm:max-w-5xl max-h-[calc(100vh-24px)] flex flex-col scrollbar"
            showCloseButton={false}
          >
            <Editor
              modelLabel={model.label}
              id={resource.id}
              initialValues={{
                [adminModel.fk_name]: { id: relId, __str__: relName },
              }}
              onSave={() => setEdit(false)}
              onClose={() => setEdit(false)}
              onDelete={() => setEdit(false)}
            />
          </DialogContent>
        )}
      </Dialog>
      <TableRow
        onClick={() => !readOnly && setEdit(true)}
        className={cn({
          "hover:bg-transparent": readOnly,
        })}
      >
        {adminModel.list_display?.map((field) => (
          <TableCell key={field}>
            <FormatRenderer
              value={resource[field]}
              field={model.fields[field]}
            />
          </TableCell>
        ))}
      </TableRow>
    </>
  );
}
