/**
 * Currency utilities for YallaWish2
 * Handles currency detection from URLs, currency code mapping, and formatting
 */

/**
 * Map of domain patterns to currency codes (ISO 4217)
 */
const DOMAIN_TO_CURRENCY: Record<string, string> = {
  // Amazon
  "amazon.ae": "AED",
  "amazon.sa": "SAR",
  "amazon.eg": "EGP",
  "amazon.com": "USD",
  "amazon.co.uk": "GBP",
  "amazon.de": "EUR",
  "amazon.fr": "EUR",
  "amazon.it": "EUR",
  "amazon.es": "EUR",
  "amazon.in": "INR",
  "amazon.co.jp": "JPY",
  "amazon.ca": "CAD",
  "amazon.com.au": "AUD",
  "amazon.com.br": "BRL",
  "amazon.mx": "MXN",

  // eBay
  "ebay.ae": "AED",
  "ebay.com": "USD",
  "ebay.co.uk": "GBP",
  "ebay.de": "EUR",
  "ebay.fr": "EUR",
  "ebay.ca": "CAD",
  "ebay.com.au": "AUD",

  // Regional retailers
  "namshi.com": "AED",
  "noon.com": "AED",
  "souq.com": "AED",
  "carrefour.ae": "AED",
  "emiratesairlines.com": "AED",

  // Other major retailers
  "walmart.com": "USD",
  "target.com": "USD",
  "bestbuy.com": "USD",
  "alibaba.com": "CNY",
  "aliexpress.com": "USD",
};

/**
 * Map of country codes to currency codes (ISO 4217)
 */
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  AE: "AED", // United Arab Emirates
  SA: "SAR", // Saudi Arabia
  EG: "EGP", // Egypt
  KW: "KWD", // Kuwait
  QA: "QAR", // Qatar
  BH: "BHD", // Bahrain
  OM: "OMR", // Oman
  JO: "JOD", // Jordan
  LB: "LBP", // Lebanon
  US: "USD", // United States
  GB: "GBP", // United Kingdom
  CA: "CAD", // Canada
  AU: "AUD", // Australia
  IN: "INR", // India
  JP: "JPY", // Japan
  DE: "EUR", // Germany
  FR: "EUR", // France
  IT: "EUR", // Italy
  ES: "EUR", // Spain
  BR: "BRL", // Brazil
  MX: "MXN", // Mexico
  CN: "CNY", // China
};

/**
 * Detect currency from a product URL by domain
 * @param url The product URL
 * @returns Currency code (e.g., "AED") or null if not detected
 */
export function detectCurrencyFromUrl(url: string): string | null {
  if (!url) return null;

  try {
    // Extract domain from URL
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Direct domain match (e.g., "amazon.ae")
    if (DOMAIN_TO_CURRENCY[hostname]) {
      return DOMAIN_TO_CURRENCY[hostname];
    }

    // Check for subdomain + domain patterns (e.g., "www.amazon.ae")
    const parts = hostname.split(".");
    if (parts.length >= 2) {
      // Try matching last 2 parts (domain + TLD)
      const domainTld = parts.slice(-2).join(".");
      if (DOMAIN_TO_CURRENCY[domainTld]) {
        return DOMAIN_TO_CURRENCY[domainTld];
      }

      // Try matching last 3 parts (subdomain + domain + TLD)
      if (parts.length >= 3) {
        const subdomainDomainTld = parts.slice(-3).join(".");
        if (DOMAIN_TO_CURRENCY[subdomainDomainTld]) {
          return DOMAIN_TO_CURRENCY[subdomainDomainTld];
        }
      }
    }
  } catch (e) {
    // Invalid URL
    console.warn("[CurrencyUtils] Invalid URL:", url, e);
  }

  return null;
}

/**
 * Get currency code from country code
 * @param countryCode Two-letter ISO country code (e.g., "AE")
 * @returns Currency code (e.g., "AED") or null if not found
 */
export function getCurrencyFromCountryCode(countryCode?: string): string | null {
  if (!countryCode) return null;
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || null;
}

/**
 * Validate if a string is a valid ISO 4217 currency code
 * @param code Currency code to validate
 * @returns True if valid, false otherwise
 */
export function isValidCurrencyCode(code?: string): boolean {
  if (!code || code.length !== 3) return false;
  // Valid ISO 4217 codes are 3 uppercase letters
  return /^[A-Z]{3}$/.test(code);
}

/**
 * Format a price with currency prefix
 * @param price The numeric price value
 * @param currency Currency code (default: "AED")
 * @returns Formatted price string (e.g., "AED 225.00")
 */
export function formatPriceWithCurrency(price: number | string | null | undefined, currency: string = "AED"): string {
  if (price === null || price === undefined || price === "") {
    return `${currency} 0.00`;
  }

  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(numPrice)) {
    return `${currency} 0.00`;
  }

  // Format with 2 decimal places
  return `${currency} ${numPrice.toFixed(2)}`;
}

/**
 * Extract just the numeric value from a price string (e.g., "AED 225.00" -> 225)
 * @param priceStr Price string with or without currency prefix
 * @returns Numeric value as string or empty string
 */
export function extractNumericPrice(priceStr: string): string {
  if (!priceStr) return "";

  // Remove currency prefix if present (e.g., "AED " or "USD ")
  const match = priceStr.match(/^\s*[A-Z]{3}\s*(.+)$/);
  if (match) {
    return match[1].trim();
  }

  return priceStr.trim();
}

/**
 * Get default currency for the app
 * Falls back to AED (main market)
 * @returns Default currency code
 */
export function getDefaultCurrency(): string {
  return "AED";
}
