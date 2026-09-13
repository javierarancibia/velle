import Link from "next/link";

export const metadata = {
  title: "Star Map — A Real Sky, Not a Template | Velle",
  description:
    "A custom star chart of the sky at the exact date, time, and place that matters to you. Made from real astronomy, not a decorative template.",
};

const GALLERY = [
  {
    src: "/landing/gallery-wife.png",
    caption: "A birthday gift she'll actually keep",
  },
  {
    src: "/landing/gallery-husband.png",
    caption: "For the anniversary he won't forget you remembered",
  },
  {
    src: "/landing/gallery-kid.png",
    caption: "Mark the night they were born",
  },
  {
    src: "/landing/gallery-grandmother.png",
    caption: "A quiet gift that means more than it looks",
  },
];

export default function StarMapLandingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative w-full" style={{ aspectRatio: "1184 / 1014" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing/hero.png"
          alt="A custom star map, framed, on a living room wall"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(10,8,20,0.55), rgba(10,8,20,0) 55%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:pb-20 text-center">
          <h1 className="text-white text-3xl md:text-5xl font-medium max-w-2xl mx-auto">
            The real sky, from the night that mattered
          </h1>
          <p className="mt-4 text-white/85 max-w-lg mx-auto">
            A star map calculated for your exact date, time, and place — not a decorative
            template. Made to be kept, not scrolled past.
          </p>
          <Link
            href="/products/star-map"
            className="inline-block mt-8 bg-white text-foreground px-8 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Design yours now
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-4xl px-6 py-14 grid sm:grid-cols-3 gap-8 text-center">
        <div>
          <p className="font-medium">Real astronomy</p>
          <p className="mt-1 text-sm text-muted">
            Calculated from the actual sky, not a stock design with your name added.
          </p>
        </div>
        <div>
          <p className="font-medium">Made near you</p>
          <p className="mt-1 text-sm text-muted">
            ~87–90% of orders produced locally across NL/DE/FR/BE. 2–5 day delivery.
          </p>
        </div>
        <div>
          <p className="font-medium">Honestly priced</p>
          <p className="mt-1 text-sm text-muted">
            €45, all-inclusive. No premium markup for the same real accuracy.
          </p>
        </div>
      </section>

      {/* Gallery — illustrative, not customer testimonials */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="text-xl font-medium text-center">However you'd give it</h2>
        <p className="mt-2 text-sm text-muted text-center max-w-md mx-auto">
          A few of the moments people mark with theirs.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GALLERY.map((g) => (
            <div key={g.src} className="rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.src} alt={g.caption} className="w-full h-auto" />
              <p className="mt-2 text-sm text-muted">{g.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur px-6 py-3">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <p className="text-sm hidden sm:block">Made from your own date, time, and place.</p>
          <Link
            href="/products/star-map"
            className="w-full sm:w-auto text-center bg-accent text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Design yours now
          </Link>
        </div>
      </div>
      {/* Spacer so the sticky bar doesn't cover the last gallery row */}
      <div className="h-20" />
    </div>
  );
}
