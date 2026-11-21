const reviews = [
  {
    name: "Mary Jane",
    text: "My go to earrings and necklaces are graceful and simple - they look good with my old day to day clothes, and also great up when I make a bit of an effort. Jewellery that lasts a lifetime and still looks good today. Love it.",
  },
  {
    name: "Anamika Lusy",
    text: "The jewelry arrived beautifully polished and the details were even better in person. A lovely shopping experience.",
  },
  {
    name: "Sophia Wu",
    text: "I appreciate the craftsmanship and attention to detail in every item. These jewels aren’t just accessories; they’re treasured heirlooms in the making.",
  },
  {
    name: "Layla Morgan",
    text: "The quality is unmatched. I’ve received countless compliments and always recommend this brand to friends looking for something special.",
  },
  {
    name: "Nina Patel",
    text: "I love how versatile these pieces are — easy to mix and match, whether dressing up for an event or adding flair to everyday wear.",
  },
  {
    name: "Isabella Cruz",
    text: "The perfect blend of classic and contemporary styles. These jewels have a timeless appeal that never goes out of fashion.",
  },
];

const INSTAGRAM_URL = "https://www.instagram.com/zenv.oraa/";

/** Figma Home > Testimonials (Instagram card + review slider). */
export function HomeTestimonials() {
  return (
    <section className="relative overflow-hidden px-zv-20 py-zv-40 lg:py-[143px] lg:pl-[60px] lg:pr-0">
      <img
        src="/zenvoraa/home/testimonials-bg.webp"
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 size-full object-cover opacity-50"
      />

      <div className="relative flex flex-col gap-zv-20 lg:flex-row lg:bg-zv-bg/75 lg:p-zv-20">
        {/* Instagram */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-[14px] rounded-leaf-mirror bg-zv-bg p-6 text-center lg:min-w-[316px] lg:flex-1 lg:justify-center lg:gap-zv-10 lg:p-zv-20"
        >
          <span className="text-base text-zv-primary">Share your sparkle</span>
          <span className="font-zv-display text-[28px] italic text-zv-ink-brown lg:text-2xl lg:text-zv-ink">
            Follow us on Instagram
          </span>
          <img
            src="/zenvoraa/home/instagram-qr.png"
            alt="QR code for the ZenVoraa Instagram account"
            loading="lazy"
            className="size-[230px] lg:size-[276px]"
          />
          <span className="text-base text-zv-primary">@zenv.oraa</span>
        </a>

        {/* Reviews */}
        <div className="-mx-zv-20 overflow-hidden bg-zv-bg/75 p-zv-10 lg:mx-0 lg:bg-transparent lg:p-0">
          <ul className="flex snap-x snap-mandatory gap-zv-20 overflow-x-auto [scrollbar-width:thin]">
            {reviews.map((r) => (
              <li
                key={r.name}
                className="flex w-[288px] shrink-0 snap-start flex-col overflow-hidden rounded-leaf bg-white lg:min-h-[407px] lg:w-[300px]"
              >
                <img
                  src="/zenvoraa/home/review-photo.webp"
                  alt=""
                  loading="lazy"
                  className="h-[210px] w-full bg-zv-image-well object-cover lg:h-[200px]"
                />
                <div className="flex flex-col gap-3 p-zv-20 text-zv-ink-brown lg:gap-zv-10 lg:px-zv-10 lg:text-zv-ink">
                  <img
                    src="/zenvoraa/icons/stars-review.svg"
                    alt="Rated 5 out of 5"
                    width={134}
                    height={22}
                    className="h-[18px] w-[122px] lg:h-[22px] lg:w-[134px]"
                  />
                  <p className="text-sm leading-[1.5] lg:leading-normal">{r.text}</p>
                  <p className="type-signature lg:text-sm">-{r.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
