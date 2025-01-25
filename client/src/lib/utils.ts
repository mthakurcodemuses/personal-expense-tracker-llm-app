import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(amount);
}

export const categoryColors = {
  Transportation: "hsl(258, 90%, 66%)",
  Groceries: "hsl(328, 85%, 64%)",
  "Dining Out": "hsl(200, 95%, 64%)",
  Shopping: "hsl(158, 85%, 50%)",
  Entertainment: "hsl(48, 95%, 53%)"
};
