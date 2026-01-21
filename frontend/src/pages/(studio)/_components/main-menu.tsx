import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PiCaretDownBold,
  PiCaretRightBold,
  PiFileTextBold,
  PiHouseSimpleBold,
  PiImageBold,
  PiNutBold,
  PiSignOut,
} from "react-icons/pi";
import { Link, type Path, useNavigate } from "react-router";

import { useAuth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminInfo } from "@/hooks/use-admin-info";
import { useDiscover } from "@/hooks/use-discover";
import { useMe } from "@/hooks/use-me";
import { cn } from "@/lib/utils";
import { useTenant } from "@/tenant.tsx";
import type { TailwindColor } from "@/types";

import { TenantSelector } from "./tenant-selector";

export function MainMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { data: adminInfo } = useAdminInfo();
  const { data: me } = useMe();
  const { data: discover } = useDiscover();
  const { enabled: tenant } = useTenant();

  return (
    <nav className="w-[240px] shrink-0 flex flex-col bg-stone-50 border-r">
      {adminInfo && (
        <div className="flex items-center gap-2 border-b p-3">
          <div className="bg-gradient-to-tl from-stone-900 to-stone-600 size-7 rounded flex items-center justify-center text-white font-black shrink-0">
            {adminInfo.site_header[0]}
          </div>
          <h2 className="line-clamp-1 break-all text-base font-semibold">
            {adminInfo.site_header}
          </h2>
        </div>
      )}
      {tenant && (
        <div className="p-1 border-b">
          <TenantSelector />
        </div>
      )}

      <div className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar">
        <MenuItem
          to="/"
          color="slate"
          icon={<PiHouseSimpleBold />}
          label={t("main_menu.dashboard")}
        />
        {discover?.media_library.enabled && (
          <MenuItem
            to="/media-library"
            color="pink"
            icon={<PiImageBold />}
            label={t("main_menu.media_library")}
          />
        )}

        <div className="h-4" role="separator" />

        {discover?.model_groups.map((group) => (
          <MenuItem
            key={group.name}
            color={group.color ?? "blue"}
            icon={group.icon ?? <PiFileTextBold />}
            label={group.label}
          >
            {group.models
              .map((label) => {
                const model = discover.models.find(R.whereEq({ label }));

                return model ? (
                  <MenuItem
                    key={label}
                    to={
                      model.admin.is_singleton
                        ? { hash: `editor:${model.label}` }
                        : `/content/${model.label}`
                    }
                    label={model.verbose_name_plural}
                    icon={model.admin.icon ?? <PiFileTextBold />}
                  />
                ) : null;
              })
              .filter((el) => !R.isNil(el))}
          </MenuItem>
        ))}

        <div className="h-4" role="separator" />

        <MenuItem to="/" icon={<PiNutBold />} label={t("main_menu.settings")} />
      </div>
      <div className="p-1 border-t">
        {me && (
          <DropdownMenu>
            <DropdownMenuContent side="right" align="start">
              <DropdownMenuItem
                onClick={() => {
                  setToken(null);
                  navigate("/login");
                }}
              >
                <PiSignOut />
                {t("main_menu.log_out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
            <DropdownMenuTrigger className="flex items-center text-left w-full gap-3 hover:bg-stone-200 data-[state=open]:bg-stone-200 p-2 rounded-md select-none">
              <div className="relative rounded-full size-8 bg-indigo-500 text-indigo-100 flex items-center justify-center font-bold shrink-0 text-xs">
                {`${me.first_name ?? ""}${me.last_name ?? ""}${me.username ?? ""}`
                  .trim()
                  .replace(/\s/g, "")
                  .slice(0, 2)
                  .toUpperCase()}
                <div className="bg-emerald-500 size-2 rounded-full absolute bottom-px right-px" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {`${me.first_name ?? ""} ${me.last_name ?? ""}`.trim()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {me.username}
                </div>
              </div>
            </DropdownMenuTrigger>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}

const COLORS: Record<TailwindColor, string> = {
  slate: "bg-slate-200 text-slate-600",
  gray: "bg-gray-200 text-gray-600",
  zinc: "bg-zinc-200 text-zinc-600",
  neutral: "bg-neutral-200 text-neutral-600",
  stone: "bg-stone-200 text-stone-600",
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  amber: "bg-amber-100 text-amber-600",
  yellow: "bg-yellow-100 text-yellow-600",
  lime: "bg-lime-100 text-lime-600",
  green: "bg-green-100 text-green-600",
  emerald: "bg-emerald-100 text-emerald-600",
  teal: "bg-teal-100 text-teal-600",
  cyan: "bg-cyan-100 text-cyan-600",
  sky: "bg-sky-100 text-sky-600",
  blue: "bg-blue-100 text-blue-600",
  indigo: "bg-indigo-100 text-indigo-600",
  violet: "bg-violet-100 text-violet-600",
  purple: "bg-purple-100 text-purple-600",
  fuchsia: "bg-fuchsia-100 text-fuchsia-600",
  pink: "bg-pink-100 text-pink-600",
  rose: "bg-rose-100 text-rose-600",
};

function MenuItem({
  label,
  icon,
  to,
  color,
  children,
}: {
  label: string;
  icon?: React.ReactNode | string;
  to?: Partial<Path> | string;
  color?: TailwindColor;
  children?: React.ReactElement[];
}) {
  const Comp = to ? Link : "button";
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Comp
        // @ts-expect-error due to mixed component
        to={to ?? undefined}
        className="flex items-center w-full text-sm font-medium gap-2 h-8 px-2 hover:bg-stone-100 rounded hover:cursor-default"
        onClick={() => {
          if (children) {
            setCollapsed(!collapsed);
          }
        }}
      >
        {icon && (
          <span
            className={cn(
              "size-5 rounded flex items-center justify-center",
              color ? COLORS[color] : "text-stone-500",
            )}
          >
            {typeof icon === "string" ? <span className={cn(icon)} /> : icon}
          </span>
        )}
        <span className="flex items-center justify-between flex-1">
          <span className="first-letter:uppercase line-clamp-1 break-all">
            {label}
          </span>
          {children ? (
            collapsed ? (
              <PiCaretDownBold />
            ) : (
              <PiCaretRightBold />
            )
          ) : null}
        </span>
      </Comp>
      {children && collapsed ? <div className="pl-3">{children}</div> : null}
    </>
  );
}
