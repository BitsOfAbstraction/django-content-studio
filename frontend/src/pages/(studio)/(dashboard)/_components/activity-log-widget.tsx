import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { useHttp } from "@/hooks/use-http";
import { type ActivityLogEntry, type DashboardWidget } from "@/types";

export function ActivityLogWidget({ widget }: { widget: DashboardWidget }) {
  const http = useHttp();
  const { t } = useTranslation();
  const { data } = useQuery({
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    queryKey: ["dashboard", "widgets", widget.widget_id],
    async queryFn() {
      const { data } = await http.get<ActivityLogEntry[]>(
        `/dashboard/widgets/${widget.widget_id}`,
      );

      return data;
    },
  });

  return (
    <div className="p-4">
      <h2 className="font-medium">
        {t("dashboard.widgets.activity_log.title")}
      </h2>
      <div className="text-muted-foreground font-medium mb-6">
        {t("dashboard.widgets.activity_log.subtitle")}
      </div>
      <ul className="space-y-4">
        {data?.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <div className="shrink-0 rounded-full bg-gray-200 size-8 flex items-center justify-center font-semibold uppercase select-none">
              {item.user?.__str__.slice(0, 2)}
            </div>
            <div>
              <div className="flex gap-1 font-medium">
                <div>{item.user?.__str__}</div>
                <div className="text-gray-500">
                  {t(
                    `dashboard.widgets.activity_log.action_flags.${item.action_flag}`,
                  )}
                </div>
                <div className="line-clamp-1 break-all">
                  {item.action_flag === 3 ? (
                    item.object_repr
                  ) : (
                    <Link
                      className="hover:underline"
                      to={{
                        hash: `editor:${item.object_model}:${item.object_id}`,
                      }}
                    >
                      {item.object_repr}
                    </Link>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-400 font-medium">
                {dayjs(item.action_time).fromNow()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
