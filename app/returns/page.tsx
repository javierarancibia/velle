export const metadata = {
  title: "Guarantee & Returns — Velle",
  description: "Our guarantee for custom prints: what we cover, and why personalized keepsakes work differently from off-the-shelf returns.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-medium">Our guarantee</h1>

      <p className="mt-6 text-muted">
        Every piece we make is created specifically for you — your date, your place, your
        story. Because of that, we can&apos;t accept returns for a change of mind once
        production has started. Under EU consumer law, personalized and custom-made goods are
        exempt from the standard 14-day right of withdrawal, since they can&apos;t be resold to
        someone else. This is normal for made-to-order keepsakes, not specific to us.
      </p>

      <p className="mt-4 text-muted">
        What we do guarantee: if your print arrives damaged, or the star chart doesn&apos;t
        match the date, time, and place you submitted, we&apos;ll reprint and reship it —
        free, no argument. Made to be kept means it has to actually be right.
      </p>

      <h2 className="mt-10 text-lg font-medium">If something&apos;s wrong</h2>
      <p className="mt-3 text-muted">
        {/* TODO(javier): needs a real, monitored inbox before this goes live to customers —
            nothing here yet actually receives mail (orders@velle.es is send-only, used for
            operator notifications). */}
        Email us at <span className="font-medium">info@velle.es</span> within 30 days
        of delivery with a photo of the issue, and we&apos;ll sort it out.
      </p>

      <h2 className="mt-10 text-lg font-medium">Delivery</h2>
      <p className="mt-3 text-muted">
        Most orders are produced locally in your own country — around 87–90% of orders across
        the Netherlands, Germany, France, and Belgium — and arrive within 2–5 business days.
      </p>
    </div>
  );
}
