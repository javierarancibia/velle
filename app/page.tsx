import Link from "next/link";

const products = [
  {
    href: "/products/star-map",
    name: "Star Map",
    tagline: "The sky, exactly as it was that night.",
  },
  {
    href: "/products/pet-portrait",
    name: "Pet Portrait",
    tagline: "A keepsake portrait of the one who's always by your side.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-medium tracking-tight max-w-2xl mx-auto">
          Keepsakes made from your own story
        </h1>
        <p className="mt-5 text-muted max-w-xl mx-auto">
          Not a template — a print made from your photo, or your moment. Designed to be kept, not scrolled past.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-6 pb-24">
        {products.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group border border-border rounded-lg p-8 flex flex-col justify-between min-h-56 hover:border-accent transition-colors"
          >
            <div>
              <h2 className="text-xl font-medium">{p.name}</h2>
              <p className="mt-2 text-sm text-muted">{p.tagline}</p>
            </div>
            <span className="mt-6 text-sm text-accent group-hover:underline">Personalize yours →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
