import { type ClassValue, clsx } from "clsx";
import * as R from "ramda";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = R.pipe(
  R.path(["response", "data"]),
  R.ifElse(Array.isArray, R.head, R.prop("detail")),
  R.defaultTo("Error"),
);
