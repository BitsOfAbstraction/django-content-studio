import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import { useDiscover } from "@/hooks/use-discover";
import { ExtensionType } from "@/types";

export function CatchAllPage() {
  const { data: discover } = useDiscover();
  const { "*": path } = useParams();
  const { t } = useTranslation();
  const iframePage = discover?.extensions.find(
    R.where({
      extension_type: R.equals(ExtensionType.IFramePage),
      config: R.whereEq({ path: `/${path}` }),
    }),
  );

  return iframePage ? (
    <iframe src={iframePage.config.iframe_url} className="flex-1" />
  ) : (
    <div className="flex-1 bg-white flex items-center justify-center">
      <span className="select-none">{t("app.not_found")}</span>
    </div>
  );
}
