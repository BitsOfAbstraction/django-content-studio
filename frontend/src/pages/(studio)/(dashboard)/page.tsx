import { useDiscover } from "@/hooks/use-discover";
import { cn } from "@/lib/utils.ts";
import { DashboardWidgetType } from "@/types";

import { ActivityLogWidget } from "./_components/activity-log-widget";
import { ScheduledTasksWidget } from "./_components/scheduled-tasks-widget";
import { StatisticWidget } from "./_components/statistic-widget";

const WIDGET_COMPONENTS = {
  [DashboardWidgetType.ActivityLogWidget]: ActivityLogWidget,
  [DashboardWidgetType.StatisticWidget]: StatisticWidget,
  [DashboardWidgetType.ScheduledTasksWidget]: ScheduledTasksWidget,
};

export function DashboardPage() {
  const { data: discover } = useDiscover();

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-5">Dashboard</h1>
      <div className="flex flex-col md:grid md:items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {discover?.dashboard.widgets.map((widget) => {
          const Comp = WIDGET_COMPONENTS[widget.name];

          return Comp ? (
            <div
              key={widget.widget_id}
              className={cn({
                "border border-gray-300 bg-white shadow-md shadow-gray-900/5 rounded-lg":
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
