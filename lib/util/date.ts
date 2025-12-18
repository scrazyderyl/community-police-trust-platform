export function getRelativeDateMonths(monthOffset: number, from: Date = new Date()): Date {
  const year = from.getFullYear();
  const month = from.getMonth();
  const day = from.getDate();

  const targetYear = year;
  const targetMonth = month + monthOffset;

  // Get last day of target month and clamp to valid range
  const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
  const targetDay = Math.min(day, lastDayOfTargetMonth);

  return new Date(
    targetYear,
    targetMonth,
    targetDay,
    from.getHours(),
    from.getMinutes(),
    from.getSeconds(),
    from.getMilliseconds()
  );
}