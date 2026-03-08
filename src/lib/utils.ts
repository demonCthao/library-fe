import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from "date-fns";
import _ from 'lodash';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function convertObjectToParam<T extends object>(obj: T) {
  return new URLSearchParams(
    Object.entries(obj as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v).trim()])
  ).toString()
}

function mergeDefaults<T extends Record<string, any>>(
  defaults: T,
  data?: Partial<T>
): T {
  return {
    ...defaults,
    ...data,
  };
}

function formatDate(date: string | undefined | null) {
  if (!_.isNull(date) && !_.isUndefined(date)) {
    return format(new Date(date), "dd/MM/yyyy");
  }

  return ""
}

export { cn, convertObjectToParam, mergeDefaults, formatDate }