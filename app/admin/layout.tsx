import Link from "next/link";

// Sits under the storefront header for every /admin page.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <nav className="border-b border-border bg-white/60">
        <div className="mx-auto max-w-7xl px-6 py-2 flex gap-5 text-sm">
          <span className="text-muted">Admin</span>
          <Link href="/admin/clients" className="hover:text-accent">
            Clientes
          </Link>
          <Link href="/admin/orders" className="hover:text-accent">
            Pedidos
          </Link>
          <Link href="/admin/test-email" className="hover:text-accent">
            Email de prueba
          </Link>
        </div>
      </nav>
      {children}
    </>
  );
}
