"use client";

import * as React from "react";
import Link from "next/link";
import { MainNav } from "./main-nav";

export function Header() {
  return (
    <header className="sticky top-0 w-full border-b pl-5 pr-5">
      <div className="h-16 container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/swaptalk-logo.svg" alt="Swaptalk logo" className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-primary">Swaptalk</h1>
        </Link>

        {/* desktop nav */}
        <MainNav />
      </div>
    </header>
  );
}
