import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Sort dates descending
  const sortedDates = [...new Set(dates)].sort((a, b) => b.localeCompare(a));

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // If most recent date is not today or yesterday, streak is broken
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(sortedDates[0]);

  for (const dateStr of sortedDates) {
    // Check if dateStr matches expected current date in sequence
    // Simplified: Just check if dateStr is the next day back
    // Actually, handling gaps is tricky with string dates. 
    // Easier: Loop backwards from today/yesterday and check existence.
    const checkDate = new Date(currentDate);
    // This loop logic is getting complex for a replace.
    // Let's use a robust approach:
    // Iterate day by day backwards from "most recent valid entry (today/yesterday)"
    break; // Placeholder for logic below
  }

  // Robust Iterative Approach
  let currentStreak = 0;
  // Start checking from Today
  let checkDate = new Date();
  let checkStr = checkDate.toISOString().split('T')[0];

  // If today is completed, count it. If not, check yesterday.
  if (dates.includes(checkStr)) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
    checkStr = checkDate.toISOString().split('T')[0];
  } else {
    // Today not done. Check yesterday.
    checkDate.setDate(checkDate.getDate() - 1);
    checkStr = checkDate.toISOString().split('T')[0];
    if (!dates.includes(checkStr)) return 0; // Neither today nor yesterday
  }

  // Count backwards continuously
  while (dates.includes(checkStr)) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
    checkStr = checkDate.toISOString().split('T')[0];
  }

  return currentStreak;
}
