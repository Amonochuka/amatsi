/** Validates international phone format, e.g. +254712345678 */
export const isValidPhone = (phone: string): boolean =>
  /^\+[1-9]\d{7,14}$/.test(phone.trim());