import * as R from "ramda";

import type { FormSet, Model } from "@/types";

import { FormField } from "./form-field";

export function FormSet({
  formSet,
  model,
  hiddenFields = [],
}: {
  formSet: FormSet;
  model: Model;
  hiddenFields?: string[];
}) {
  return (
    <div>
      <div className="mb-3 empty:hidden">
        {formSet.title && (
          <h4 className="font-semibold text-xl text-gray-700">
            {formSet.title}
          </h4>
        )}
        {formSet.description ? (
          <div className="text-sm text-muted-foreground">
            {formSet.description}
          </div>
        ) : null}
      </div>
      <div className="space-y-5">
        {formSet.fields.map((formField, idx) =>
          R.has("fields", formField) ? (
            <div
              key={idx}
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${formField.fields.length}, 1fr)`,
              }}
            >
              {formField.fields
                .filter((f) => !hiddenFields.includes(f.name))
                .map((innerFormField, idx) => (
                  <FormField
                    key={idx}
                    formField={innerFormField}
                    model={model}
                  />
                ))}
            </div>
          ) : (
            !hiddenFields.includes(formField.name) && (
              <FormField key={idx} formField={formField} model={model} />
            )
          ),
        )}
      </div>
    </div>
  );
}
