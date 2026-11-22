/**
 * Customer-facing store rules shown on the storefront.
 * Keep in sync with the server, which is the source of truth:
 *   shipping → server/src/modules/orders/order.service.ts (placeOrder)
 *   returns  → /refund-policy page
 */
export const FREE_SHIPPING_THRESHOLD = 2000;
export const SHIPPING_FEE = 25;

export const DISPATCH_TIME = "1–3 business days";
export const RETURN_WINDOW_SUMMARY = "Damaged, defective or incorrect items: report within 48 hours of delivery";

/** Default care text (from the Figma design); a product specification named "Care Instructions" overrides it. */
export const DEFAULT_CARE_INSTRUCTIONS =
  "It is advisable to avoid contact with water and organic chemicals i.e. perfume sprays. Store jewellery in airtight box. After use, wipe the jewellery with soft cotton cloth.";

export const CARE_SPEC_KEY = "care instructions";
