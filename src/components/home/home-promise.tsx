/** Figma Home > Our Story ("Our Promise"). */
export function HomePromise() {
  return (
    <section className="bg-white lg:grid lg:grid-cols-2 lg:gap-zv-20">
      <div className="flex flex-col gap-6 px-6 py-zv-40 text-zv-ink-brown lg:justify-center lg:gap-zv-40 lg:px-zv-40 lg:text-zv-ink">
        <div className="flex flex-col gap-6 lg:mx-auto lg:max-w-[614px] lg:gap-[50px]">
          <h2 className="font-zv-display text-[32px] italic lg:text-[36px]">Our Promise</h2>
          <p className="text-base leading-[1.55] lg:text-xl lg:leading-normal">
            At ZenVoraa, we believe every woman deserves to shine with confidence, elegance, and style
            without compromising on affordability. From everyday wear to festive glamour, our carefully
            curated premium artificial jewelry reflects the latest fashion trends while ensuring
            exceptional craftsmanship and lasting durability.
          </p>
        </div>
        <img
          src="/zenvoraa/home/delivery-journey.webp"
          alt="Our four steps: curated by style, checked for finish, packed with care, ready to celebrate"
          loading="lazy"
          className="aspect-[1942/809] w-full object-cover"
        />
      </div>
      <img
        src="/zenvoraa/home/promise-packaging.webp"
        alt="ZenVoraa jewellery with its signature gift packaging"
        loading="lazy"
        className="aspect-square w-full object-cover"
      />
    </section>
  );
}
