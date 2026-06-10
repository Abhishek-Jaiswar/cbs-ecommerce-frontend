/**
 * Formats a number into Indian Rupees (INR) currency format.
 */
export function formatRupees(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^\d.-]/g, "")) : amount;
  if (isNaN(num)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Extracts 2-letter uppercase initials from a full name.
 */
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
