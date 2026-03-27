import { Outlet } from "react-router";

import { ContentEditor } from "@/components/content-editor";
import { TenantProvider } from "@/tenant.tsx";

import { MainMenu } from "./_components/main-menu";

export function StudioLayout() {
  return (
    <TenantProvider>
      <div className="h-screen flex items-stretch">
        <MainMenu />
        <ContentEditor />
        <div className="p-2 flex-1 overflow-hidden bg-muted flex flex-col">
          <div className="flex-1 bg-background border border-card rounded-md shadow-xs flex flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </TenantProvider>
  );
}
