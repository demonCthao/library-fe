import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function convertObjectToParam<T extends object>(obj: T) {
  return new URLSearchParams(
    Object.entries(obj as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  ).toString()
}

export { cn, convertObjectToParam }