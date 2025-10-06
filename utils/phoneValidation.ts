// Phone Number Validation for UAE Mobile Numbers
// Based on Vault22 Global Flutter app

/**
 * UAE Mobile Number Validation Rules:
 * - Country code: +971
 * - Must start with 05 or 5
 * - Total length: 9 digits (excluding country code)
 * - Examples:
 *   ✓ +971 50 123 4567
 *   ✓ +971 56 789 0123
 *   ✓ 0501234567
 *   ✓ 501234567
 *   ✗ +971 43 123 456 (landline)
 *   ✗ +971 60 123 4567 (invalid prefix)
 */

export function validateUAEMobile(phone: string, dialCode: string = '+971'): boolean {
  // Remove country code and all spaces
  let cleaned = phone.replace(dialCode, '').replace(/\s/g, '').trim();

  // Remove leading zero if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Check if starts with 5 (UAE mobile prefix)
  const startsWithValidPrefix = cleaned.startsWith('5');

  // Check length (should be 9 digits: 501234567)
  const hasValidLength = cleaned.length === 9;

  return startsWithValidPrefix && hasValidLength;
}

/**
 * Format phone number for API submission
 * Removes country code, spaces, and leading zero
 * Returns: "501234567"
 */
export function formatPhoneNumber(phone: string, dialCode: string = '+971'): string {
  // Remove country code, spaces, and leading zero
  let cleaned = phone
    .replace(dialCode, '')
    .replace(/\s/g, '')
    .replace(/^0+/, '')
    .trim();

  return cleaned; // Returns: "501234567"
}

/**
 * Format phone number for display
 * Returns: "50 123 4567"
 */
export function displayPhoneNumber(phone: string, dialCode: string = '+971'): string {
  const formatted = formatPhoneNumber(phone, dialCode);

  // Format for display: 50 123 4567
  if (formatted.length >= 9) {
    return `${formatted.slice(0, 2)} ${formatted.slice(2, 5)} ${formatted.slice(5)}`;
  }

  return formatted;
}

/**
 * Format phone number as user types
 * Adds spaces for readability
 */
export function formatPhoneInput(value: string): string {
  // Remove all non-numeric characters except +
  let cleaned = value.replace(/[^\d+]/g, '');

  // Ensure it starts with +971
  if (!cleaned.startsWith('+971')) {
    if (cleaned.startsWith('971')) {
      cleaned = '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '+971' + cleaned.substring(1);
    } else if (cleaned.match(/^\d/)) {
      cleaned = '+971' + cleaned;
    } else {
      cleaned = '+971';
    }
  }

  // Format as: +971 50 123 4567
  const parts = cleaned.match(/^(\+971)(\d{0,2})(\d{0,3})(\d{0,4})$/);

  if (parts) {
    let formatted = parts[1];
    if (parts[2]) formatted += ' ' + parts[2];
    if (parts[3]) formatted += ' ' + parts[3];
    if (parts[4]) formatted += ' ' + parts[4];
    return formatted.trim();
  }

  return cleaned;
}
