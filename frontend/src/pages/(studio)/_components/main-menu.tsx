import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PiCaretDownBold,
  PiCaretRightBold,
  PiFileTextBold,
  PiHouseSimpleBold,
  PiImageBold,
  PiSignOutBold,
} from "react-icons/pi";
import { Link, type Path, useMatch, useNavigate } from "react-router";

import { useAuth } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminInfo } from "@/hooks/use-admin-info";
import { useDiscover } from "@/hooks/use-discover";
import { useMe } from "@/hooks/use-me";
import { cn } from "@/lib/utils";
import { useTenant } from "@/tenant.tsx";
import { ExtensionType, type TailwindColor } from "@/types";

import { TenantSelector } from "./tenant-selector";

export function MainMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { data: adminInfo } = useAdminInfo();
  const { data: me } = useMe();
  const { data: discover } = useDiscover();
  const { enabled: tenant } = useTenant();
  const linkExtensions =
    discover?.extensions.filter(
      R.whereEq({ extension_type: ExtensionType.MainMenuLink }),
    ) ?? [];

  return (
    <nav className="w-[240px] shrink-0 flex flex-col bg-gray-50">
      {adminInfo && !tenant && (
        <div className="flex items-center gap-2 px-4 py-3 select-none">
          <div className="bg-gradient-to-tl from-gray-900 to-gray-600 size-5 rounded flex items-center justify-center text-white font-black shrink-0">
            {adminInfo.site_header[0]}
          </div>
          <h2 className="line-clamp-1 break-all text-base font-semibold text-gray-800">
            {adminInfo.site_header}
          </h2>
        </div>
      )}
      {tenant && (
        <div className="border-b">
          <TenantSelector />
        </div>
      )}

      <div className="flex-1 px-2 pb-2 pt-4 space-y-1 overflow-y-auto scrollbar">
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

        {linkExtensions.map(({ extension_id, config }) => (
          <MenuItem
            key={extension_id}
            to={config.url}
            color={config.color}
            icon={<span className={config.icon} />}
            label={config.label}
          />
        ))}

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
                    isSubItem
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
      </div>
      <div className="border-t">
        {me && (
          <DropdownMenu>
            <DropdownMenuContent
              side="top"
              align="start"
              className="p-0 w-(--radix-dropdown-menu-trigger-width)"
            >
              <div className="px-4 py-2 border-b leading-tight">
                <div className="text-gray-700 font-semibold">
                  {`${me.first_name ?? ""} ${me.last_name ?? ""}`.trim()}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {me.username}
                </div>
              </div>
              <div className="p-1.5">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setToken(null);
                      navigate("/login");
                    }}
                  >
                    {t("main_menu.log_out")}
                    <PiSignOutBold />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </div>
              {adminInfo && (
                <div className="px-4 py-2 bg-gray-100 border-t cursor-default">
                  <div className="text-sm font-medium text-gray-700 text-center">
                    {adminInfo.site_title}
                  </div>
                  <div className="text-xs font-medium text-gray-400 text-center">{`v${adminInfo.version}`}</div>
                </div>
              )}
            </DropdownMenuContent>
            <DropdownMenuTrigger className="flex items-center text-left w-full gap-3 hover:bg-gray-100 data-[state=open]:bg-gray-100 p-3 select-none hover:cursor-pointer">
              <div className="relative rounded-full size-8 bg-indigo-500 text-indigo-100 flex items-center justify-center font-bold shrink-0 text-xs">
                {`${me.first_name ?? ""}${me.last_name ?? ""}${me.username ?? ""}`
                  .trim()
                  .replace(/\s/g, "")
                  .slice(0, 2)
                  .toUpperCase()}
                <div className="bg-emerald-500 size-2 rounded-full absolute bottom-px right-px" />
              </div>
              <div className="text-gray-700 truncate">
                {`${me.first_name ?? ""} ${me.last_name ?? ""}`.trim()}
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
  isSubItem,
}: {
  label: string;
  isSubItem?: boolean;
  icon?: React.ReactNode | string;
  to?: Partial<Path> | string;
  color?: TailwindColor;
  children?: React.ReactElement[];
}) {
  const Comp = to ? Link : "button";
  const match = useMatch(`${to ?? ""}`);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Comp
        // @ts-expect-error due to mixed component
        to={to ?? undefined}
        className={cn(
          "group flex items-center w-full font-medium gap-2.5 h-8 px-2 hover:bg-gray-100 rounded hover:cursor-pointer",
          {
            "bg-gray-100": !R.isNil(to) && match,
          },
        )}
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
              color ? COLORS[color] : "text-gray-500",
            )}
          >
            {typeof icon === "string" ? <span className={cn(icon)} /> : icon}
          </span>
        )}
        <span
          className={cn(
            "flex items-center justify-between flex-1",
            isSubItem ? "text-gray-600" : "text-gray-800",
          )}
        >
          <span className="first-letter:uppercase line-clamp-1 break-all">
            {label}
          </span>
          {children ? (
            <div className="group-hover:bg-gray-200 p-1 rounded">
              {collapsed ? <PiCaretDownBold /> : <PiCaretRightBold />}
            </div>
          ) : null}
        </span>
      </Comp>
      {children && collapsed ? <div className="pl-3">{children}</div> : null}
    </>
  );
}
