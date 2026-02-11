import { useDiscover } from "@/hooks/use-discover";
import { cn } from "@/lib/utils.ts";
import { DashboardWidgetType } from "@/types";

import { ActivityLogWidget } from "./_components/activity-log-widget";
import { ContentListWidget } from "./_components/content-list-widget";
import { ScheduledTasksWidget } from "./_components/scheduled-tasks-widget";
import { StatisticWidget } from "./_components/statistic-widget";

const WIDGET_COMPONENTS = {
  [DashboardWidgetType.ActivityLogWidget]: ActivityLogWidget,
  [DashboardWidgetType.StatisticWidget]: StatisticWidget,
  [DashboardWidgetType.ScheduledTasksWidget]: ScheduledTasksWidget,
  [DashboardWidgetType.ContentListWidget]: ContentListWidget,
};

export function DashboardPage() {
  const { data: discover } = useDiscover();

  return (
    <div className="overflow-hidden flex-1 flex flex-col">
      <h1 className="px-5 py-2 text-xl font-semibold border-b">Dashboard</h1>
      <div className="p-5 flex flex-col md:grid md:items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-y-auto scrollbar">
        {discover?.dashboard.widgets.map((widget) => {
          const Comp = WIDGET_COMPONENTS[widget.name];

          return Comp ? (
            <div
              key={widget.widget_id}
              className={cn({
                "border border-gray-300 bg-white rounded-lg":
                  widget.name !== DashboardWidgetType.SpacingWidget,
              })}
              style={{
                gridColumn: `span ${widget.col_span} / span ${widget.col_span}`,
              }}
            >
              <Comp widget={widget} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}
