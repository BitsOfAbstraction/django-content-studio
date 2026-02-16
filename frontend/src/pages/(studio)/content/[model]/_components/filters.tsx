import * as R from "ramda";

import type { Model } from "@/types";

import { FiltersSelect } from "./filters-select";
import { Search } from "./search";

export function Filters({ model }: { model: Model }) {
  const filters = model.admin.list.filter ?? [];

  return (
    <div className="flex items-start gap-4">
      {model.admin.list.search && <Search />}
      {!R.isEmpty(filters) && <FiltersSelect model={model} />}
    </div>
  );
}
