import { useIsMutating } from "@tanstack/react-query";
import * as R from "ramda";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { PiCheckBold, PiUpload } from "react-icons/pi";
import { toast } from "sonner";

import { FolderPath } from "@/components/media-library/folder-path";
import { Folders } from "@/components/media-library/folders";
import { ItemCard } from "@/components/media-library/item-card";
import { Button } from "@/components/ui/button";
import { DebouncedInput } from "@/components/ui/debounced-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { useCreateMedia } from "@/hooks/use-create-media";
import { useListMedia } from "@/hooks/use-list-media";
import { cn, getErrorMessage } from "@/lib/utils";

export function SelectDialog({
  children,
  multiple,
  onSelect,
}: {
  children: React.ReactElement;
  multiple: boolean;
  onSelect(v: any | any[]): void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-full sm:max-w-[calc(100%-48px)] max-h-[calc(100%-48px)] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("widgets.media_widget.dialog_title")}</DialogTitle>
        </DialogHeader>
        <SelectDialogContent multiple={multiple} onSelect={onSelect} />
      </DialogContent>
    </Dialog>
  );
}

function SelectDialogContent({
  multiple,
  onSelect,
}: {
  multiple: boolean;
  onSelect(v: any | any[]): void;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [folder, setFolder] = useState<string | null>(null);
  const { data } = useListMedia({ folder, page, filters: { search } });
  const { mutateAsync } = useCreateMedia();
  const pendingCount = useIsMutating({
    mutationKey: ["media-library", "items"],
  });
  const handleUpload = useCallback(
    async (acceptedFiles: File[]) => {
      await Promise.all(
        acceptedFiles.map(async (f) => {
          try {
            const fileType = R.cond([
              [R.startsWith("image/"), R.always("image")],
              [R.startsWith("video/"), R.always("video")],
              [R.startsWith("audio/"), R.always("audio")],
              [R.T, R.always("file")],
            ])(f.type);

            const data = await mutateAsync({
              folder,
              name: f.name,
              file: f,
              type: fileType,
            });
            setSelection(multiple ? R.append(data) : R.always([data]));
          } catch (e) {
            toast.error(getErrorMessage(e));
          }
        }),
      );
    },
    [folder, multiple, mutateAsync],
  );

  return (
    <DropzoneArea onDrop={handleUpload}>
      <div className={cn("mb-2", { invisible: search })}>
        <FolderPath
          folder={folder}
          onSelect={(folderId) => {
            setPage(1);
            setFolder(folderId);
          }}
        />
      </div>

      <div className="mb-2 flex items-center gap-2">
        <DebouncedInput
          size="sm"
          placeholder={t("common.search")}
          value={search}
          onChange={(v) => {
            setPage(1);
            setSearch(v);
          }}
        />
        <Button
          variant="outline"
          className="select-none text-sm font-medium"
          onClick={() => inputRef.current?.click()}
        >
          <PiUpload />
          {t("widgets.media_widget.upload_label")}
        </Button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          onChange={async (e) => {
            const { files } = e.target;
            if (files) {
              await handleUpload(Array.from(files));
            }
          }}
        />
      </div>

      <div className={cn("mb-2", { hidden: search })}>
        <Folders
          parent={folder}
          onSelect={(folderId) => {
            setPage(1);
            setFolder(folderId);
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto border rounded scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 p-2">
          {R.times(R.identity, pendingCount).map((i) => (
            <div key={i} className="p-4 rounded border space-y-2">
              <div className="aspect-square rounded-md bg-accent animate-pulse flex items-center justify-center">
                <Spinner />
              </div>
              <div className="bg-accent animate-pulse rounded-md h-2.5" />
            </div>
          ))}

          {data?.results.map((item: any) => {
            const isSelected = selection.some(R.whereEq({ id: item.id }));

            return (
              <ItemCard
                key={item.id}
                item={item}
                className={cn("relative", {
                  "border-gray-400": isSelected,
                })}
                onClick={() => {
                  if (multiple) {
                    setSelection(
                      !isSelected ? R.append(item) : R.without([item]),
                    );
                  } else {
                    setSelection(isSelected ? [] : [item]);
                  }
                }}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 right-0 bottom-0 bg-foreground/40 z-10">
                    <div className="size-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center absolute z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 shadow">
                      <PiCheckBold className="size-2.5" />
                    </div>
                  </div>
                )}
              </ItemCard>
            );
          })}
        </div>
      </div>

      {data?.pagination ? (
        <div className="empty:hidden mt-3 flex justify-center">
          <Pagination
            onPageChange={setPage}
            current={data.pagination.current}
            pages={data.pagination.pages}
          />
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-2 mt-6">
        <div className="flex -space-x-5 h-10">
          {selection.map((item) =>
            item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt=""
                className="size-10 rounded-md object-cover border-2 border-white"
              />
            ) : (
              <div className="size-10 bg-gray-100 rounded-md border-2 border-white" />
            ),
          )}
        </div>
        <div className="flex items-center gap-2">
          <DialogClose asChild>
            <Button variant="ghost">{t("common.cancel")}</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={R.isEmpty(selection)}
              onClick={() => onSelect(multiple ? selection : selection[0])}
            >
              {multiple && selection.length > 0
                ? t("widgets.media_widget.select_n_media", {
                    n: selection.length,
                  })
                : t("widgets.media_widget.select_media")}
            </Button>
          </DialogClose>
        </div>
      </div>
    </DropzoneArea>
  );
}

function DropzoneArea({
  onDrop,
  children,
}: {
  onDrop(files: File[]): void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { getRootProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="flex-1 flex flex-col overflow-hidden">
      {isDragActive && (
        <div className="absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center select-none z-20 bg-slate-900/40 rounded-md">
          <div className="relative rounded-lg border-dashed border aspect-square flex items-center justify-center p-12">
            <div className="rounded-lg border aspect-square animate-ping size-full absolute" />
            <span className="text-white font-medium">
              {t("widgets.media_widget.upload_label")}
            </span>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
