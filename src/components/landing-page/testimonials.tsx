import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    author: "Lindsy Niloms",
    image: "/corano/testimonial/testimonial-1.png",
    quote:
      "Vivamus a lobortis ipsum, vel condimentum magna. Etiam id turpis tortor. Nunc scelerisque, nisi a blandit varius.",
  },
  {
    author: "Daisy Millan",
    image: "/corano/testimonial/testimonial-2.png",
    quote:
      "Nunc purus venenatis ligula, sed venenatis orci augue nec sapien. The finish and packaging felt truly premium.",
  },
  {
    author: "Anamika Lusy",
    image: "/corano/testimonial/testimonial-3.png",
    quote:
      "The jewelry arrived beautifully polished and the details were even better in person. A lovely shopping experience.",
  },
];

function SectionTitle({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <div className="mb-10 text-center font-[var(--font-corano)]">
      <h2 className="text-3xl font-bold capitalize text-[#222222] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-[#777777]">{subtitle}</p>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative py-20 bg-white">
      <Image
        src="/corano/testimonial/testimonials-bg.jpg"
        alt="Testimonials background"
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-white/70" />
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <SectionTitle title="testimonials" subtitle="What they say" />
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.author} className="font-[var(--font-corano)]">
              <Image
                src={testimonial.image}
                alt={testimonial.author}
                width={86}
                height={86}
                className="mx-auto rounded-full"
              />
              <p className="mt-6 text-sm leading-7 text-[#555555]">
                {testimonial.quote}
              </p>
              <div className="mt-4 flex justify-center text-[#c29958]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <h3 className="mt-4 text-sm font-bold uppercase text-[#222222]">
                {testimonial.author}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
