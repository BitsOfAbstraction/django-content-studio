import { useDiscover } from "@/hooks/use-discover";
import { DashboardWidgetType } from "@/types";

import { ActivityLogWidget } from "./_components/activity-log-widget";

const WIDGET_COMPONENTS = {
  [DashboardWidgetType.ActivityLogWidget]: ActivityLogWidget,
};

export function DashboardPage() {
  const { data: discover } = useDiscover();

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-5">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {discover?.dashboard.widgets.map((widget) => {
          const Comp = WIDGET_COMPONENTS[widget.name];

          return (
            <div
              className="border border-gray-300 bg-white shadow-md shadow-gray-900/5 rounded-lg"
              style={{
                gridColumn: `span ${widget.col_span} / span ${widget.col_span}`,
              }}
            >
              <Comp />
            </div>
          );
        })}
      </div>
    </div>
  );
}
