// Pay Period Calculation Logic
// Based on Vault22's pay period system

/**
 * Calculates the current pay period based on the user's budget start day
 * Pay period format: YYYYMM (e.g., 202410 for October 2024 period)
 */
export function getCurrentPayPeriod(dayOfMonthPaid: number): number {
  const now = new Date();
  return getPayPeriodForDayOfMonth(now, dayOfMonthPaid);
}

/**
 * Get pay period for a specific date and budget start day
 */
export function getPayPeriodForDayOfMonth(date: Date, startDayOfMonth: number): number {
  let calendar = new Date(date);

  // Handle "last day of month" option (30, 31)
  if (startDayOfMonth >= 30) {
    startDayOfMonth = getDaysInMonth(calendar);
  }

  const currentDay = calendar.getDate();

  // Adjust for mid-month start
  if (startDayOfMonth < 15 && currentDay < startDayOfMonth) {
    calendar = subtractMonths(calendar, 1);
  }

  // Adjust for non-mid-month start
  if (!(startDayOfMonth < 15 || currentDay < startDayOfMonth)) {
    calendar = addMonths(calendar, 1);
  }

  return payPeriodFromDate(calendar);
}

/**
 * Convert date to pay period number (YYYYMM)
 */
export function payPeriodFromDate(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-indexed, so add 1
  return year * 100 + month;
}

/**
 * Get start date of a pay period
 */
export function getStartDateOfPayPeriod(payPeriod: number, dayOfMonthPaid: number): Date {
  const year = Math.floor(payPeriod / 100);
  const month = payPeriod % 100;

  let day = dayOfMonthPaid;
  if (day > 28) {
    day = getDaysInMonth(new Date(year, month - 1));
  }

  let startDate = new Date(year, month - 1, day);

  if (day >= 15) {
    startDate = subtractMonths(startDate, 1);
  }

  return startDate;
}

/**
 * Get end date of a pay period
 */
export function getEndDateOfPayPeriod(payPeriod: number, dayOfMonthPaid: number): Date {
  const startDate = getStartDateOfPayPeriod(payPeriod, dayOfMonthPaid);
  const endDate = addMonths(startDate, 1);
  return subtractDays(endDate, 1);
}

/**
 * Get days remaining in current pay period
 */
export function getDaysRemainingInPeriod(payPeriod: number, dayOfMonthPaid: number): number {
  const endDate = getEndDateOfPayPeriod(payPeriod, dayOfMonthPaid);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Helper functions

function getDaysInMonth(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function subtractMonths(date: Date, months: number): Date {
  return addMonths(date, -months);
}

function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

/**
 * Format pay period for display
 */
export function formatPayPeriod(payPeriod: number): string {
  const year = Math.floor(payPeriod / 100);
  const month = payPeriod % 100;
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Get pay period date range as string
 */
export function getPayPeriodRange(payPeriod: number, dayOfMonthPaid: number): string {
  const startDate = getStartDateOfPayPeriod(payPeriod, dayOfMonthPaid);
  const endDate = getEndDateOfPayPeriod(payPeriod, dayOfMonthPaid);

  const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const start = startDate.toLocaleDateString('en-US', formatOptions);
  const end = endDate.toLocaleDateString('en-US', formatOptions);

  return `${start} - ${end}`;
}
