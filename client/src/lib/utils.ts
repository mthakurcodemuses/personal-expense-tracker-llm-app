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
  Transportation: "hsl(215, 85%, 45%)",
  Groceries: "hsl(150, 75%, 40%)",
  "Dining Out": "hsl(280, 75%, 45%)",
  Shopping: "hsl(45, 85%, 50%)",
  Entertainment: "hsl(330, 85%, 45%)"
};