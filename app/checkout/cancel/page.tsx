import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-medium">Checkout canceled</h1>
      <p className="mt-4 text-muted">No charge was made. You can pick up where you left off any time.</p>
      <Link href="/" className="mt-8 inline-block text-accent hover:underline">
        Back to Kindred
      </Link>
    </div>
  );
}
