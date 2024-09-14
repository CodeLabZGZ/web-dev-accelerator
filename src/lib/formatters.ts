/**
 * Formats a given amount as a currency string.
 *
 * @param {number} amount - The numerical value to be formatted.
 * @param {string} locale - The locale used for formatting (e.g., "en-US", "es-ES").
 * @param {string} currency - The currency code to be used (e.g., "USD", "EUR").
 * @returns {string} A string representing the formatted price with the correct currency symbol and locale formatting.
 *
 * @example
 * renderPrice(1234.56, "en-US", "USD");
 * // Returns: "$1,234.56"
 */
export function renderPrice(
  amount: number,
  locale: string,
  currency: string
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount)
}
