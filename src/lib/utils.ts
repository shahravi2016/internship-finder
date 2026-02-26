import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Detects salary strings in job extensions and adds missing currency symbols.
 * Heuristic: If it contains 'a year', 'an hour', or 'a month' and starts with a digit/K.
 */
export function formatJobExtension(ext: string, location: string = ""): string {
  const salaryKeywords = ["a year", "an hour", "a month", "per year", "per hour"];
  const hasSalaryKeyword = salaryKeywords.some(kw => ext.toLowerCase().includes(kw));
  const hasCurrencySymbol = /[$\u20B9\u00A3\u20AC]/.test(ext); // $, ₹, £, €

  if (hasSalaryKeyword && !hasCurrencySymbol) {
    // Determine currency based on location if possible, otherwise default to $ for international formats
    const isIndia = location.toLowerCase().includes("india") || location.toLowerCase().includes("in");
    const symbol = isIndia ? "₹" : "$";
    
    // If it starts with a number or range like "100K-150K", prepend symbol
    if (/^\d|^\d+K/.test(ext)) {
      return `${symbol}${ext}`;
    }
  }
  
  return ext;
}
