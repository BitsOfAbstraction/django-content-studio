import * as R from "ramda";

import type { Model } from "@/types";

import { FormSet } from "./form-set";

export function Aside({
  model,
  hiddenFields,
}: {
  model: Model;
  hiddenFields: string[];
}) {
  const {
    admin: {
      edit: { sidebar },
    },
  } = model;
  const hasSidebar = !R.isEmpty(sidebar) && !R.isNil(sidebar);

  return (
    hasSidebar && (
      <div className="w-full max-w-[360px]">
        <div className="p-6">
          <aside className="space-y-8">
            {sidebar.map((formSet, idx) => (
              <section
                key={idx}
                className="border-b border-gray-200 last-of-type:border-b-0 pb-8 w-full"
              >
                <FormSet
                  model={model}
                  formSet={formSet}
                  hiddenFields={hiddenFields}
                />
              </section>
            ))}
          </aside>
        </div>
      </div>
    )
  );
}
