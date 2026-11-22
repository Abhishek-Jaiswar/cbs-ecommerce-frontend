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

/** Default care text; a product specification named "Care Instructions" overrides it. */
export const DEFAULT_CARE_INSTRUCTIONS = [
  "Keep away from water, perfume, lotions and sanitiser; put your jewellery on last and take it off first.",
  "Store each piece separately in its ZenVoraa pouch or box to prevent scratches and tarnish.",
  "Wipe gently with a soft, dry cloth after wearing. Avoid chemical cleaners.",
];

export const CARE_SPEC_KEY = "care instructions";
