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
        <div className="p-2 flex-1 overflow-hidden bg-gray-50 flex flex-col">
          <div className="flex-1 bg-white border rounded-md shadow-xs shadow-gray-800/5 flex flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </TenantProvider>
  );
}
