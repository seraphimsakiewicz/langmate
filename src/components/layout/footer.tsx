"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-6">
      <div className="flex flex-col items-center justify-center gap-4">
        <nav className="flex gap-6">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
        </nav>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Swaptalk. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
