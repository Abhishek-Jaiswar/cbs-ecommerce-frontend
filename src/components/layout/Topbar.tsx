import Container from "../common/Container";
import Link from "next/link";

export default function TopBar() {
  return (
    <div className="hidden border-b bg-black text-sm text-white lg:block">
      <Container>
        <div className="flex h-10 items-center justify-between">
          <p>
            Free Shipping On Orders Over ₹999
          </p>

          <div className="flex items-center gap-6">
            <Link href="/track-order">
              Track Order
            </Link>

            <Link href="/wishlist">
              Wishlist
            </Link>

            <Link href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}