"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/nav";

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {mainNav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-[var(--nav-active-bg)] text-[var(--fg)]"
                : "text-[var(--muted)] hover:bg-[var(--hover)] hover:text-[var(--fg)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
